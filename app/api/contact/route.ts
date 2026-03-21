import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Use service role key server-side so RLS doesn't block inserts
const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, service, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'name, email and message are required' },
                { status: 400 },
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 },
            );
        }

        const { error } = await supabase
            .from('contact_messages')
            .insert([{ name, email, service: service || null, message }]);

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json(
                { error: 'Database error' },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('Contact API error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
