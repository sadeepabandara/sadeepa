import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Latest crypto prices (AUD) from Kraken's public ticker. One upstream call
// serves every visitor: results are shared for a few seconds.
const KRAKEN_TICKER = 'https://api.kraken.com/0/public/Ticker?pair=XBTAUD,ETHAUD,SOLAUD';

type Body = { updated: number; prices: Record<string, number>; error?: string };
let memo: { at: number; body: Body } | null = null;

export async function GET() {
    if (memo && Date.now() - memo.at < 2000) {
        return NextResponse.json(memo.body, {
            headers: { 'Cache-Control': 'public, s-maxage=2, stale-while-revalidate=2' },
        });
    }
    try {
        const res = await fetch(KRAKEN_TICKER, {
            headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
            signal: AbortSignal.timeout(6000),
            cache: 'no-store',
        });
        if (!res.ok) throw new Error(`kraken ${res.status}`);
        const json = await res.json();
        const prices: Record<string, number> = {};
        for (const [pair, v] of Object.entries(json?.result ?? {})) {
            const sym = pair.includes('XBT') ? 'BTC' : pair.includes('ETH') ? 'ETH' : pair.includes('SOL') ? 'SOL' : null;
            // Last-trade price can sit still for minutes on thin AUD markets, so use the
            // midpoint of the best bid/ask (updates whenever the order book moves).
            const t = v as { a?: string[]; b?: string[]; c?: string[] };
            const ask = Number(t.a?.[0]);
            const bid = Number(t.b?.[0]);
            const last = Number(t.c?.[0]);
            const px = ask > 0 && bid > 0 ? (ask + bid) / 2 : last;
            if (sym && Number.isFinite(px)) prices[sym] = Math.round(px * 100) / 100;
        }
        if (!Object.keys(prices).length) throw new Error('kraken: no prices');
        const body: Body = { updated: Date.now(), prices };
        memo = { at: Date.now(), body };
        return NextResponse.json(body, {
            headers: { 'Cache-Control': 'public, s-maxage=2, stale-while-revalidate=2' },
        });
    } catch (e) {
        return NextResponse.json(
            { updated: Date.now(), prices: {}, error: (e as Error).message } satisfies Body,
            { status: 502, headers: { 'Cache-Control': 'no-store' } },
        );
    }
}
