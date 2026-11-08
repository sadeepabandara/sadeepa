'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ASSETS,
    RANGES,
    RANGE_KEYS,
    type AssetSeries,
    type MarketAsset,
    type MarketsResponse,
    type RangeKey,
} from '@/lib/markets';

gsap.registerPlugin(ScrollTrigger);

const UP = '#3ddc97';
const DOWN = '#ff5a52';

const money = (n: number) =>
    'A$' +
    n.toLocaleString('en-AU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: n >= 1000 ? 2 : n >= 1 ? 2 : 4,
    });

const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;

function fmtDate(t: number, range: RangeKey) {
    const d = new Date(t * 1000);
    if (range === '1D')
        return d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' });
    if (range === '1W' || range === '1M')
        return d.toLocaleString('en-AU', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
        });
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Build SVG line/area paths for a series inside a W×H box. */
function buildPaths(points: [number, number][], W: number, H: number, pad: number, base?: number) {
    const vals = points.map((p) => p[1]);
    let min = Math.min(...vals);
    let max = Math.max(...vals);
    if (base !== undefined) {
        min = Math.min(min, base);
        max = Math.max(max, base);
    }
    const span = max - min || 1;
    const x = (i: number) => (i / (points.length - 1)) * W;
    const y = (v: number) => H - pad - ((v - min) / span) * (H - pad * 2);
    const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p[1]).toFixed(1)}`).join(' ');
    return { line, area: `${line} L${W} ${H} L0 ${H} Z`, x, y };
}

function Spark({ series, color }: { series: AssetSeries; color: string }) {
    if (!series.points) return <div className="w-[64px] h-[26px]" />;
    const { line } = buildPaths(series.points, 100, 32, 3);
    return (
        <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-[64px] h-[26px] shrink-0" aria-hidden>
            <path d={line} fill="none" stroke={color} strokeWidth={1.6} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
    );
}

// How I split my investing (percentages only; each list should add up to 100).
type Slice = { symbol: string; pct: number; color: string };

const ETF_ALLOCATION: Slice[] = [
    { symbol: 'IVV', pct: 50, color: '#eb5939' },
    { symbol: 'NDQ', pct: 20, color: '#6c8cff' },
    { symbol: 'VEU', pct: 20, color: '#b07cff' },
    { symbol: 'A200', pct: 10, color: '#e8b04a' },
];

const CRYPTO_ALLOCATION: Slice[] = [
    { symbol: 'BTC', pct: 60, color: '#f7931a' },
    { symbol: 'ETH', pct: 30, color: '#5aa0ff' },
    { symbol: 'SOL', pct: 10, color: '#c26bff' },
];

function AllocationPie({
    items,
    selected,
    onSelect,
    size = 'lg',
}: {
    items: Slice[];
    selected: string;
    onSelect: (symbol: string) => void;
    size?: 'md' | 'lg';
}) {
    const R = 76;
    const C = 2 * Math.PI * R;
    const GAP = 3;
    const active = items.find((a) => a.symbol === selected);
    let acc = 0;
    return (
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
            <div className={`relative shrink-0 ${size === 'lg' ? 'w-[250px] h-[250px] sm:w-[280px] sm:h-[280px]' : 'w-[220px] h-[220px] sm:w-[240px] sm:h-[240px]'}`}>
                <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full -rotate-90"
                    role="img"
                    aria-label={`Split: ${items.map((a) => `${a.symbol} ${a.pct}%`).join(', ')}`}
                >
                    {items.map((a) => {
                        const len = (a.pct / 100) * C;
                        const start = acc;
                        acc += len;
                        const on = a.symbol === selected;
                        const dash = Math.max(len - GAP, 0);
                        return (
                            <circle
                                key={a.symbol}
                                cx={100}
                                cy={100}
                                r={R}
                                fill="none"
                                stroke={a.color}
                                strokeWidth={on ? 26 : 18}
                                strokeDasharray={`${dash} ${C - dash}`}
                                strokeDashoffset={-start}
                                style={{ opacity: on ? 1 : 0.25, transition: 'opacity .35s ease, stroke-width .35s ease', cursor: 'pointer' }}
                                onClick={() => onSelect(a.symbol)}
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className={`font-extrabold leading-none tracking-[-0.03em] text-fg ${size === 'lg' ? 'text-[30px] sm:text-[34px]' : 'text-[26px] sm:text-[30px]'}`}>{active ? `${active.pct}%` : ''}</div>
                    <div className="mt-2 font-syne text-[10px] tracking-[0.24em]" style={{ color: active?.color }}>
                        {active?.symbol}
                    </div>
                </div>
            </div>

            <div className="w-full sm:flex-1 min-w-0">
                {items.map((a) => {
                    const on = a.symbol === selected;
                    const name = ASSETS.find((x) => x.symbol === a.symbol)?.name ?? a.symbol;
                    return (
                        <button
                            key={a.symbol}
                            onClick={() => onSelect(a.symbol)}
                            aria-pressed={on}
                            className="w-full flex items-center gap-3 py-2.5 text-left transition-opacity duration-300"
                            style={{ opacity: on ? 1 : 0.5 }}
                        >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: a.color }} />
                            <span className="font-syne text-[12px] font-bold tracking-[0.06em] text-fg w-[44px]">{a.symbol}</span>
                            <span className="text-[11px] truncate flex-1" style={{ color: 'var(--fg2)' }}>
                                {name}
                            </span>
                            <span className="text-[13px] text-fg">{a.pct}%</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function Markets() {
    const sectionRef = useRef<HTMLElement>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const [range, setRange] = useState<RangeKey>('1M');
    const [selected, setSelected] = useState('IVV');
    const [data, setData] = useState<MarketsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [hover, setHover] = useState<number | null>(null);
    const [live, setLive] = useState<Record<string, number>>({});
    const [flash, setFlash] = useState<Record<string, 'up' | 'down'>>({});
    const liveRef = useRef<Record<string, number>>({});
    const userPicked = useRef(false);

    // Near-real-time crypto prices: poll every 5s while the section is on screen.
    useEffect(() => {
        let stop = false;
        let inView = true;
        const el = sectionRef.current;
        const io = el
            ? new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { rootMargin: '300px' })
            : null;
        if (el && io) io.observe(el);

        const tick = async () => {
            if (stop || document.hidden || !inView) return;
            try {
                const res = await fetch('/api/markets/live');
                if (!res.ok) return;
                const json = await res.json();
                const prices: Record<string, number> = json?.prices ?? {};
                const prev = liveRef.current;
                const fl: Record<string, 'up' | 'down'> = {};
                for (const [sym, p] of Object.entries(prices)) {
                    if (prev[sym] !== undefined && p !== prev[sym]) fl[sym] = p > prev[sym] ? 'up' : 'down';
                }
                liveRef.current = { ...prev, ...prices };
                setLive(liveRef.current);
                if (Object.keys(fl).length) {
                    setFlash(fl);
                    setTimeout(() => setFlash({}), 700);
                }
            } catch {
                /* keep showing the last price */
            }
        };
        void tick();
        const id = setInterval(tick, 5000);
        return () => {
            stop = true;
            clearInterval(id);
            io?.disconnect();
        };
    }, []);

    // If the default asset has no data, open on the first one that does.
    useEffect(() => {
        if (!data || userPicked.current) return;
        const cur = data.assets.find((x) => x.symbol === selected);
        if (cur && !cur.error) return;
        const firstOk = data.assets.find((x) => !x.error);
        if (firstOk) setSelected(firstOk.symbol);
    }, [data, selected]);

    // Apply the latest live price to a series (moves the end of the line too).
    const withLive = (s?: AssetSeries): AssetSeries | undefined => {
        if (!s?.points) return s;
        const p = live[s.symbol];
        if (p === undefined) return s;
        const pts = s.points.slice();
        pts[pts.length - 1] = [pts[pts.length - 1][0], p];
        return { ...s, price: p, points: pts };
    };

    const load = useCallback(async (r: RangeKey, silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await fetch(`/api/markets?range=${r}`);
            if (!res.ok) throw new Error('bad status');
            const json: MarketsResponse = await res.json();
            setData(json);
            setFailed(false);
        } catch {
            if (!silent) setFailed(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void load(range);
        const id = setInterval(() => void load(range, true), 5 * 60 * 1000);
        return () => clearInterval(id);
    }, [range, load]);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.mk-fu',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    stagger: 0.12,
                    scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
                },
            );
        }, el);
        return () => ctx.revert();
    }, []);

    const asset = ASSETS.find((a: MarketAsset) => a.symbol === selected)!;
    const series = withLive(data?.assets.find((s: AssetSeries) => s.symbol === selected));
    const ok = !!series?.points && series.price !== undefined && series.base !== undefined;
    const unavailable = !ok && !loading;

    const W = 1000,
        H = 340;
    const geo = useMemo(
        () => (ok ? buildPaths(series!.points!, W, H, 28, range === '1D' ? series!.base : undefined) : null),
        [ok, series, range],
    );

    const cur = ok ? (hover !== null ? series!.points![hover][1] : series!.price!) : 0;
    const diff = ok ? cur - series!.base! : 0;
    const diffPct = ok ? (diff / series!.base!) * 100 : 0;
    const up = diff >= 0;
    const color = up ? UP : DOWN;

    const onMove = (clientX: number) => {
        const el = chartRef.current;
        if (!el || !ok) return;
        const rect = el.getBoundingClientRect();
        const f = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        setHover(Math.round(f * (series!.points!.length - 1)));
    };

    const hoverPt = ok && hover !== null ? series!.points![hover] : null;
    const hoverX = ok && hover !== null ? (hover / (series!.points!.length - 1)) * 100 : 0;
    const hoverY = ok && hover !== null && geo ? (geo.y(series!.points![hover][1]) / H) * 100 : 0;
    const baseY = ok && geo && range === '1D' ? (geo.y(series!.base!) / H) * 100 : null;

    const groups: { title: string; items: typeof ASSETS }[] = [
        { title: 'ETFs · ASX', items: ASSETS.filter((a: MarketAsset) => a.group === 'ETF') },
        { title: 'Crypto', items: ASSETS.filter((a: MarketAsset) => a.group === 'Crypto') },
    ];

    return (
        <section
            id="markets"
            ref={sectionRef}
            className="relative px-6 md:px-14 py-24 md:py-32 border-t"
            style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
        >
            {/* header */}
            <div className="mb-12 md:mb-16">
                <div className="mk-fu text-[10px] tracking-[0.38em] uppercase text-or flex items-center gap-3 mb-3">
                    <span className="w-[18px] h-px bg-or" />
                    Markets
                </div>
                <h2 className="mk-fu text-[clamp(32px,4.5vw,60px)] font-extrabold leading-[.94] tracking-[-0.03em]">
                    What I&rsquo;m investing
                    <br />
                    <em className="not-italic font-normal text-fg/50">my money in.</em>
                </h2>
                <p className="mk-fu mt-6 max-w-[520px] text-[13px] leading-[1.8]" style={{ color: 'var(--fg2)' }}>
                    A long-term mix of index ETFs and crypto. Live prices in AUD, shown for fun and to show off a chart or two.
                </p>
            </div>

            <div className="mk-fu grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
                {/* ── chart card ── */}
                <div className="border p-5 md:p-8" style={{ borderColor: 'var(--line)', background: 'var(--bg2)' }}>
                    <div className="flex items-center gap-3 mb-5">
                        <span className="font-syne text-[10px] tracking-[0.2em] px-2.5 py-1 border border-or/40 text-or">
                            {asset.symbol}
                        </span>
                        <span className="text-[12px] tracking-[0.04em]" style={{ color: 'var(--fg2)' }}>
                            {asset.name}
                        </span>
                        <span className="ml-auto flex items-center gap-2 font-syne text-[9px] tracking-[0.22em] uppercase" style={{ color: 'var(--fg2)' }}>
                            {asset.group === 'Crypto' && live[asset.symbol] !== undefined ? (
                                <>
                                    <span className="relative flex w-2 h-2">
                                        <span className="absolute inline-flex w-full h-full rounded-full animate-ping opacity-60" style={{ background: UP }} />
                                        <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: UP }} />
                                    </span>
                                    Live
                                </>
                            ) : (
                                asset.group === 'ETF' ? 'Delayed' : ''
                            )}
                        </span>
                    </div>

                    <div className="min-h-[88px]">
                        {ok ? (
                            <>
                                <div
                                    className="text-[clamp(34px,5vw,56px)] font-extrabold leading-none tracking-[-0.03em] text-fg transition-colors duration-500"
                                    style={flash[selected] && hover === null ? { color: flash[selected] === 'up' ? UP : DOWN } : undefined}
                                >
                                    {money(cur)}
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 text-[13px]" style={{ color }}>
                                    <span>
                                        {up ? '▲' : '▼'} {money(Math.abs(diff))} ({pct(diffPct)})
                                    </span>
                                    <span style={{ color: 'var(--fg2)' }}>
                                        {hoverPt ? fmtDate(hoverPt[0], range) : RANGES[range].label}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="text-[13px]" style={{ color: 'var(--fg2)' }}>
                                {loading ? (
                                    'Loading prices…'
                                ) : asset.group === 'ETF' ? (
                                    <div className="space-y-6">
                                        <div className="font-syne text-[9px] tracking-[0.3em] uppercase">How I split my ETFs</div>
                                        <AllocationPie
                                            items={ETF_ALLOCATION}
                                            selected={selected}
                                            onSelect={(sym) => {
                                                userPicked.current = true;
                                                setHover(null);
                                                setSelected(sym);
                                            }}
                                        />
                                        <p>A live price chart isn’t available for this ETF right now.</p>
                                        <a
                                            href={`https://www.google.com/finance/quote/${asset.symbol}:ASX`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 font-syne text-[11px] tracking-[0.18em] uppercase px-4 py-3 border border-or/40 text-or hover:bg-or/10 transition-colors duration-200"
                                        >
                                            View {asset.symbol} on Google Finance ↗
                                        </a>
                                    </div>
                                ) : (
                                    'Prices aren’t available right now. Please try again shortly.'
                                )}
                            </div>
                        )}
                    </div>

                    {!unavailable && (
                        <>
                    {/* chart */}
                    <div
                        ref={chartRef}
                        className="relative mt-6 h-[240px] md:h-[340px] select-none touch-pan-y"
                        onMouseMove={(e) => onMove(e.clientX)}
                        onMouseLeave={() => setHover(null)}
                        onTouchMove={(e) => onMove(e.touches[0].clientX)}
                        onTouchEnd={() => setHover(null)}
                    >
                        {ok && geo ? (
                            <>
                                <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                                    <defs>
                                        <linearGradient id="mkfill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d={geo.area} fill="url(#mkfill)" />
                                    <path d={geo.line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                                </svg>
                                {baseY !== null && (
                                    <div
                                        className="absolute left-0 right-0 border-t border-dashed pointer-events-none"
                                        style={{ top: `${baseY}%`, borderColor: 'rgba(183,171,152,0.28)' }}
                                    />
                                )}
                                {hoverPt && (
                                    <>
                                        <div
                                            className="absolute top-0 bottom-0 w-px pointer-events-none"
                                            style={{ left: `${hoverX}%`, background: 'rgba(183,171,152,0.35)' }}
                                        />
                                        <div
                                            className="absolute w-3 h-3 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                                            style={{ left: `${hoverX}%`, top: `${hoverY}%`, background: color, boxShadow: `0 0 0 4px ${color}33` }}
                                        />
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-px" style={{ background: 'var(--line)' }} />
                            </div>
                        )}
                    </div>

                    {/* ranges */}
                    <div className="mt-6 flex items-center justify-between gap-2 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
                        <div className="flex gap-1">
                            {RANGE_KEYS.map((k: RangeKey) => (
                                <button
                                    key={k}
                                    onClick={() => {
                                        setHover(null);
                                        setRange(k);
                                    }}
                                    className="font-syne text-[11px] tracking-[0.12em] px-3 py-2 transition-colors duration-200"
                                    style={{
                                        color: range === k ? color : 'var(--fg2)',
                                        background: range === k ? `${color}1f` : 'transparent',
                                    }}
                                    aria-pressed={range === k}
                                >
                                    {k}
                                </button>
                            ))}
                        </div>
                    </div>

                        </>
                    )}

                    {asset.group === 'Crypto' && (
                        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--line)' }}>
                            <div className="mb-6 font-syne text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--fg2)' }}>
                                How I split my crypto
                            </div>
                            <AllocationPie
                                items={CRYPTO_ALLOCATION}
                                size="md"
                                selected={selected}
                                onSelect={(sym) => {
                                    userPicked.current = true;
                                    setHover(null);
                                    setSelected(sym);
                                }}
                            />
                        </div>
                    )}

                    <p className="mt-5 text-[12px] leading-[1.7]" style={{ color: 'var(--fg2)' }}>
                        {asset.blurb}
                    </p>
                </div>

                {/* ── watchlist ── */}
                <div className="border" style={{ borderColor: 'var(--line)', background: 'var(--bg2)' }}>
                    {groups.map((g) => (
                        <div key={g.title}>
                            <div className="px-5 pt-5 pb-2 font-syne text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--fg2)' }}>
                                {g.title}
                            </div>
                            {g.items.map((a: MarketAsset) => {
                                const s = withLive(data?.assets.find((x: AssetSeries) => x.symbol === a.symbol));
                                const good = !!s?.points && s.price !== undefined && s.base !== undefined;
                                const d = good ? ((s!.price! - s!.base!) / s!.base!) * 100 : 0;
                                const c = d >= 0 ? UP : DOWN;
                                const active = a.symbol === selected;
                                return (
                                    <button
                                        key={a.symbol}
                                        onClick={() => {
                                            userPicked.current = true;
                                            setHover(null);
                                            setSelected(a.symbol);
                                        }}
                                        aria-pressed={active}
                                        className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 border-l-2"
                                        style={{
                                            background: active ? 'var(--or-dim)' : 'transparent',
                                            borderLeftColor: active ? 'var(--or)' : 'transparent',
                                        }}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="font-syne text-[13px] font-bold tracking-[0.06em] text-fg">{a.symbol}</div>
                                            <div className="text-[11px] truncate" style={{ color: 'var(--fg2)' }}>
                                                {a.name}
                                            </div>
                                        </div>
                                        {good && <Spark series={s!} color={c} />}
                                        <div className="text-right shrink-0 min-w-[88px]">
                                            <div
                                                className="text-[13px] text-fg transition-colors duration-500"
                                                style={flash[a.symbol] ? { color: flash[a.symbol] === 'up' ? UP : DOWN } : undefined}
                                            >
                                                {good ? money(s!.price!) : '—'}
                                            </div>
                                            <div className="text-[11px]" style={{ color: good ? c : 'var(--fg2)' }}>
                                                {good ? pct(d) : ''}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                    <div className="h-3" />
                </div>
            </div>

            <p className="mk-fu mt-8 max-w-[760px] text-[11px] leading-[1.8]" style={{ color: 'var(--fg2)' }}>
                For information only, not financial advice. These are assets I invest in. The splits show how I divide my investing, not amounts or returns.
                Prices are in AUD: crypto from Kraken (live), ETFs from Yahoo Finance (delayed).
            </p>
        </section>
    );
}
