import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { messages, system } = await req.json();

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [{ role: 'system', content: system }, ...messages],
            max_tokens: 300,
            temperature: 0.7,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        console.error('Groq error:', data?.error?.message);
        return NextResponse.json({
            reply: `Error: ${data?.error?.message ?? 'Unknown'}`,
        });
    }

    const reply =
        data?.choices?.[0]?.message?.content ??
        "I couldn't get a response. Try again!";
    return NextResponse.json({ reply });
}
