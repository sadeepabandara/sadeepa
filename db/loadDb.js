import { promises as fs } from 'fs';
import { DataAPIClient } from '@datastax/astra-db-ts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(process.env.ASTRA_DB_API_ENDPOINT, {
  namespace: process.env.ASTRA_DB_NAMESPACE
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const createCollection = async () => {
  try {
    await db.createCollection("portfolio", {
      vector: {
        dimension: 1536,
      }
    });
  } catch (error) {
    console.log("Collection already exists");
  }
};

const loadData = async () => {
  const sampleData = JSON.parse(await fs.readFile('./db/sample-data.json', 'utf8'));
  const collection = await db.collection("portfolio");

  for (const { id, info, description } of sampleData) {
    const chunks = await splitter.splitText(description);
    let i = 0;
    for (const chunk of chunks) {
      try {
        const { data } = await openai.embeddings.create({
          input: chunk, 
          model: "text-embedding-3-small"
        });

        await collection.insertOne({
          document_id: id,
          $vector: data[0]?.embedding,
          info,
          description: chunk
        });

        i++;
      } catch (error) {
        if (error.code === 'insufficient_quota') {
          console.log('Rate limit exceeded. Waiting before retrying...');
          await new Promise(resolve => setTimeout(resolve, 60000)); // Wait for 60 seconds before retrying
          // You can adjust the wait time as per your API rate limits and retry strategy
        } else {
          console.error('Error:', error);
          throw error; // Throw other errors to handle them as needed
        }
      }
    }
  }

  console.log("Data added");
};


createCollection().then(() => loadData());
