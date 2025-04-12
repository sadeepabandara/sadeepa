import { DataAPIClient } from '@datastax/astra-db-ts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import 'dotenv/config';
import OpenAI from 'openai';
import sampleData from './sample-data.json' with { type: 'json' };

// ===== Configuration =====
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const EMBEDDING_MODEL = 'text-embedding-ada-002';
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 300000; // 5 minutes

// ===== Initialize Clients =====
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, { namespace: process.env.ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: CHUNK_SIZE, chunkOverlap: CHUNK_OVERLAP });

// ===== Embedding with Retry =====
const embedWithRetry = async (text, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY_MS) => {
  for (let i = 0; i < retries; i++) {
    try {
      const { data } = await openai.embeddings.create({
        input: text,
        model: EMBEDDING_MODEL,
      });
      return data[0]?.embedding;
    } catch (error) {
      if (error.status === 429 || error.code === 'insufficient_quota') {
        const backoffDelay = delay * Math.pow(2, i); // Exponential backoff
        console.log(`Rate limited. Retry ${i + 1}/${retries} in ${backoffDelay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      } else {
        console.error("OpenAI Embedding Error:", error);
        throw error;
      }
    }
  }
  throw new Error("OpenAI embedding failed after retries");
};

// ===== Load Data into Astra DB =====
const loadData = async () => {
  const collection = await db.collection('portfolio');
  let insertedCount = 0;
  const failedDocuments = [];

  for (const { id, info, description } of sampleData) {
    try {
      const chunks = await splitter.splitText(description);
      console.log(`Processing document ${id} (${chunks.length} chunks)`);

      for (const chunk of chunks) {
        try {
          const embedding = await embedWithRetry(chunk);
          await collection.insertOne({
            document_id: id,
            $vector: embedding,
            info,
            description: chunk,
          });
          insertedCount++;
          console.log(`Inserted chunk ${insertedCount}`);
        } catch (chunkError) {
          console.error(`Failed to insert chunk for ${id}:`, chunkError);
          failedDocuments.push({ id, chunk });
        }
      }
    } catch (docError) {
      console.error(`Failed to process document ${id}:`, docError);
      failedDocuments.push({ id, error: docError.message });
    }
  }

  console.log(`Done. Inserted ${insertedCount} chunks total.`);
  if (failedDocuments.length > 0) {
    console.log(`Failed to process the following documents:`);
    console.log(JSON.stringify(failedDocuments, null, 2));
  }
};

// ===== Main Execution =====
(async () => {
  try {
    console.log("Initializing Astra DB collection...");
    await db.createCollection('portfolio', { vector: { dimension: 1536, metric: 'cosine' } });
    console.log("Collection created successfully.");
    await loadData();
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log("Collection already exists. Proceeding to load data...");
      await loadData();
    } else {
      console.error("Fatal error:", err);
      process.exit(1);
    }
  }
})();