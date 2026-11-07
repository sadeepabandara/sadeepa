import { NextResponse } from 'next/server';
import {
    ASSETS,
    RANGES,
    type AssetSeries,
    type MarketAsset,
    type MarketsResponse,
    type RangeKey,
} from '@/lib/markets';

export const dynamic = 'force-dynamic';

const UA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const YAHOO = (host: string) => `https://${host}.finance.yahoo.com`;
const KRAKEN = 'https://api.kraken.com';

type Series = AssetSeries & { reason?: string };
type Attempt = { series?: Series; reason?: string };

// ── helpers ───────────────────────────────────────────────────────────────
function thin(points: [number, number][], max = 260): [number, number][] {
    if (points.length <= max) return points;
    const step = Math.ceil(points.length / max);
    const out = points.filter((_, i) => i % step === 0);
    const last = points[points.length - 1];
    if (out[out.length - 1] !== last) out.push(last);
    return out;
}

async function get(url: string, headers: Record<string, string> = {}) {
    return fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json,text/plain,*/*', ...headers },
        signal: AbortSignal.timeout(8000),
        cache: 'no-store',
    });
}

// ── Kraken (crypto, AUD pairs) ────────────────────────────────────────────
const KRAKEN_PAIR: Record<string, string> = { BTC: 'XBTAUD', ETH: 'ETHAUD', SOL: 'SOLAUD' };
const KRAKEN_CFG: Record<RangeKey, { interval: number; days: number }> = {
    '1D': { interval: 5, days: 1 },
    '1W': { interval: 30, days: 7 },
    '1M': { interval: 240, days: 30 },
    '3M': { interval: 1440, days: 90 },
    '1Y': { interval: 1440, days: 365 },
    '5Y': { interval: 10080, days: 365 * 5 },
};

async function fromKraken(a: MarketAsset, key: RangeKey): Promise<Attempt> {
    const pair = KRAKEN_PAIR[a.symbol];
    if (!pair) return { reason: 'kraken: no pair' };
    try {
        const { interval, days } = KRAKEN_CFG[key];
        const since = Math.floor(Date.now() / 1000) - days * 86400;
        const res = await get(`${KRAKEN}/0/public/OHLC?pair=${pair}&interval=${interval}&since=${since}`);
        if (!res.ok) return { reason: `kraken ${res.status}` };
        const json = await res.json();
        if (json?.error?.length) return { reason: `kraken ${json.error[0]}` };
        const result = json?.result ?? {};
        const k = Object.keys(result).find((x) => x !== 'last');
        const rows: unknown[][] = k ? result[k] : [];
        const pts: [number, number][] = [];
        for (const r of rows) {
            const c = Number(r[4]);
            if (Number.isFinite(c)) pts.push([Number(r[0]), c]);
        }
        if (pts.length < 2) return { reason: 'kraken: no data' };
        return {
            series: {
                symbol: a.symbol,
                price: pts[pts.length - 1][1],
                base: pts[0][1],
                currency: 'AUD',
                points: thin(pts),
            },
        };
    } catch (e) {
        return { reason: `kraken ${(e as Error).name}` };
    }
}

// ── Yahoo Finance (ETFs, crypto fallback) ─────────────────────────────────
let crumbCache: { cookie: string; crumb: string; at: number } | null = null;

async function getCrumb() {
    if (crumbCache && Date.now() - crumbCache.at < 3600_000) return crumbCache;
    const r1 = await fetch('https://fc.yahoo.com', {
        headers: { 'User-Agent': UA },
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
        cache: 'no-store',
    });
    const raw = (r1.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
    const cookie = raw.map((c) => c.split(';')[0]).join('; ');
    if (!cookie) return null;
    const r2 = await get(`${YAHOO('query1')}/v1/test/getcrumb`, { Cookie: cookie });
    const crumb = (await r2.text()).trim();
    if (!r2.ok || !crumb || crumb.includes('<')) return null;
    crumbCache = { cookie, crumb, at: Date.now() };
    return crumbCache;
}

function parseYahoo(json: any, a: MarketAsset, key: RangeKey): Series | null {
    const r = json?.chart?.result?.[0];
    const ts: number[] = r?.timestamp ?? [];
    const closes: (number | null)[] = r?.indicators?.quote?.[0]?.close ?? [];
    const pts: [number, number][] = [];
    ts.forEach((t, i) => {
        const c = closes[i];
        if (typeof c === 'number' && Number.isFinite(c)) pts.push([t, c]);
    });
    if (pts.length < 2) return null;
    const meta = r.meta ?? {};
    const prev =
        typeof meta.chartPreviousClose === 'number'
            ? meta.chartPreviousClose
            : typeof meta.previousClose === 'number'
              ? meta.previousClose
              : pts[0][1];
    return {
        symbol: a.symbol,
        price: typeof meta.regularMarketPrice === 'number' ? meta.regularMarketPrice : pts[pts.length - 1][1],
        base: key === '1D' ? prev : pts[0][1],
        currency: meta.currency ?? 'AUD',
        points: thin(pts),
    };
}

async function fromYahoo(a: MarketAsset, key: RangeKey): Promise<Attempt> {
    const { range, interval } = RANGES[key];
    const path = `/v8/finance/chart/${encodeURIComponent(a.yahoo)}?range=${range}&interval=${interval}&includePrePost=false`;
    const reasons: string[] = [];

    // 1) plain requests on both hosts
    for (const host of ['query1', 'query2']) {
        try {
            const res = await get(YAHOO(host) + path);
            if (!res.ok) {
                reasons.push(`yahoo ${host} ${res.status}`);
                continue;
            }
            const s = parseYahoo(await res.json(), a, key);
            if (s) return { series: s };
            reasons.push(`yahoo ${host} no data`);
        } catch (e) {
            reasons.push(`yahoo ${host} ${(e as Error).name}`);
        }
    }

    // 2) cookie + crumb flow (what browsers do)
    try {
        const c = await getCrumb();
        if (!c) {
            reasons.push('yahoo crumb unavailable');
        } else {
            const res = await get(`${YAHOO('query1')}${path}&crumb=${encodeURIComponent(c.crumb)}`, { Cookie: c.cookie });
            if (res.ok) {
                const s = parseYahoo(await res.json(), a, key);
                if (s) return { series: s };
                reasons.push('yahoo crumb no data');
            } else {
                crumbCache = null;
                reasons.push(`yahoo crumb ${res.status}`);
            }
        }
    } catch (e) {
        reasons.push(`yahoo crumb ${(e as Error).name}`);
    }
    return { reason: reasons.join('; ') };
}

async function load(a: MarketAsset, key: RangeKey): Promise<Series> {
    const reasons: string[] = [];
    if (a.group === 'Crypto') {
        const k = await fromKraken(a, key);
        if (k.series) return k.series;
        if (k.reason) reasons.push(k.reason);
    }
    const y = await fromYahoo(a, key);
    if (y.series) return y.series;
    if (y.reason) reasons.push(y.reason);
    return { symbol: a.symbol, error: true, reason: reasons.join(' | ') };
}

// ── route ─────────────────────────────────────────────────────────────────
const memo = new Map<string, { at: number; ttl: number; body: MarketsResponse }>();

export async function GET(req: Request) {
    const q = new URL(req.url).searchParams.get('range') as RangeKey | null;
    const key: RangeKey = q && q in RANGES ? q : '1M';

    const hit = memo.get(key);
    if (hit && Date.now() - hit.at < hit.ttl) {
        return NextResponse.json(hit.body, {
            headers: { 'Cache-Control': `public, s-maxage=${hit.ttl >= 300_000 ? 300 : 60}, stale-while-revalidate=300` },
        });
    }

    const assets = await Promise.all(ASSETS.map((a) => load(a, key)));
    const body: MarketsResponse = { range: key, updated: Date.now(), assets };

    const okCount = assets.filter((s) => !s.error).length;
    const ttl = okCount === assets.length ? 300_000 : okCount > 0 ? 60_000 : 0;
    if (ttl) memo.set(key, { at: Date.now(), ttl, body });

    return NextResponse.json(body, {
        headers: {
            'Cache-Control': ttl
                ? `public, s-maxage=${ttl / 1000}, stale-while-revalidate=300`
                : 'no-store',
        },
    });
}
