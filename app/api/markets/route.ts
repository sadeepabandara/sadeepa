import { NextResponse } from 'next/server';
import {
    ASSETS,
    RANGES,
    type AssetSeries,
    type MarketsResponse,
    type RangeKey,
} from '@/lib/markets';

export const dynamic = 'force-dynamic';

const UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function thin(points: [number, number][], max = 260): [number, number][] {
    if (points.length <= max) return points;
    const step = Math.ceil(points.length / max);
    const out = points.filter((_, i) => i % step === 0);
    const last = points[points.length - 1];
    if (out[out.length - 1] !== last) out.push(last);
    return out;
}

async function load(symbol: string, yahoo: string, key: RangeKey): Promise<AssetSeries> {
    const { range, interval } = RANGES[key];
    for (const host of ['query1', 'query2']) {
        try {
            const url = `https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
                yahoo,
            )}?range=${range}&interval=${interval}&includePrePost=false`;
            const res = await fetch(url, {
                headers: { 'User-Agent': UA, Accept: 'application/json' },
                signal: AbortSignal.timeout(8000),
                next: { revalidate: 300 },
            });
            if (!res.ok) continue;
            const json = await res.json();
            const r = json?.chart?.result?.[0];
            const ts: number[] = r?.timestamp ?? [];
            const closes: (number | null)[] = r?.indicators?.quote?.[0]?.close ?? [];
            const pts: [number, number][] = [];
            ts.forEach((t, i) => {
                const c = closes[i];
                if (typeof c === 'number' && Number.isFinite(c)) pts.push([t, c]);
            });
            if (pts.length < 2) continue;
            const meta = r.meta ?? {};
            const last = pts[pts.length - 1][1];
            const price: number =
                typeof meta.regularMarketPrice === 'number' ? meta.regularMarketPrice : last;
            const prev =
                typeof meta.chartPreviousClose === 'number'
                    ? meta.chartPreviousClose
                    : typeof meta.previousClose === 'number'
                      ? meta.previousClose
                      : pts[0][1];
            return {
                symbol,
                price,
                base: key === '1D' ? prev : pts[0][1],
                currency: meta.currency ?? 'AUD',
                points: thin(pts),
            };
        } catch {
            /* try next host */
        }
    }
    return { symbol, error: true };
}

export async function GET(req: Request) {
    const q = new URL(req.url).searchParams.get('range') as RangeKey | null;
    const key: RangeKey = q && q in RANGES ? q : '1M';
    const assets = await Promise.all(ASSETS.map((a) => load(a.symbol, a.yahoo, key)));
    const body: MarketsResponse = { range: key, updated: Date.now(), assets };
    return NextResponse.json(body, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
}
