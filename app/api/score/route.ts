import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Uses SERVICE ROLE key — never exposed to browser
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Simple in-memory rate limit
const recentSubmissions = new Map<string, number>();

export async function POST(req: NextRequest) {
    try {
        const { score } = await req.json();

        // 1. Must be a whole number
        if (typeof score !== 'number' || !Number.isInteger(score)) {
            return NextResponse.json(
                { error: 'Invalid score' },
                { status: 400 },
            );
        }

        // 2. Cap at 300 — humanly impossible to beat in one session
        if (score <= 0 || score > 300) {
            return NextResponse.json(
                { error: 'Score out of range' },
                { status: 400 },
            );
        }

        // 3. Rate limit — same IP only once per 30 seconds
        const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
        const lastSubmit = recentSubmissions.get(ip) ?? 0;
        const now = Date.now();
        if (now - lastSubmit < 30_000) {
            return NextResponse.json(
                { error: 'Too many submissions' },
                { status: 429 },
            );
        }
        recentSubmissions.set(ip, now);

        // 4. Only save if it beats the current global best
        const { data: best } = await supabase
            .from('flappy_scores')
            .select('score')
            .order('score', { ascending: false })
            .limit(1)
            .single();

        if (best && score <= best.score) {
            return NextResponse.json({ saved: false, globalBest: best.score });
        }

        // 5. Save the new best
        await supabase.from('flappy_scores').insert({ score });
        return NextResponse.json({ saved: true, globalBest: score });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    const { data } = await supabase
        .from('flappy_scores')
        .select('score')
        .order('score', { ascending: false })
        .limit(1)
        .single();
    return NextResponse.json({ globalBest: data?.score ?? 0 });
}
