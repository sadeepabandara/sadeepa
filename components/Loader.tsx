'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoaderProps {
    onComplete: () => void;
}

/* Loading screen: a small "if you try" decision tree fills the whole screen while a big
   counter runs 0 → 100. Straight lines, large glowing nodes. Desktop: the tree is
   horizontal and glows in from left → right. Mobile: the same tree is vertical and glows
   in from top → bottom. No flashing: a soft glow simply travels along the lines as they
   are drawn. At 100% the screen slides up. */

const ACC = '235, 89, 57'; // site accent (--or) as r, g, b
const BG = '#0d0d0d'; // site background (--bg)
const BAND = 18; // width (% of the screen) of the soft glow that travels with the drawing

type Kind = 'step' | 'fail' | 'ok';
interface TNode {
    id: string;
    h: string[]; // label lines (horizontal layout)
    v: string[]; // label lines (vertical layout)
    u: number; // step along the flow (0 = start)
    lane: number; // lane across the flow
    kind: Kind;
}

const NODES: TNode[] = [
    { id: 'root', h: ['IF YOU'], v: ['IF YOU'], u: 0, lane: 0.75, kind: 'step' },
    { id: 'dont', h: ['DON’T TRY'], v: ['DON’T TRY'], u: 1, lane: 0, kind: 'step' },
    { id: 'try', h: ['TRY'], v: ['TRY'], u: 1, lane: 1.5, kind: 'step' },
    { id: 'f1', h: ['FAIL'], v: ['FAIL'], u: 2, lane: 0, kind: 'fail' },
    { id: 'f2', h: ['FAIL'], v: ['FAIL'], u: 2, lane: 1, kind: 'fail' },
    { id: 's1', h: ['SUCCEED'], v: ['SUCCEED'], u: 2, lane: 2, kind: 'ok' },
    { id: 'b1', h: ['BUILD PERSONAL', 'CAPITAL'], v: ['BUILD', 'PERSONAL', 'CAPITAL'], u: 3, lane: 1, kind: 'step' },
    { id: 'b2', h: ['BUILD PERSONAL', 'CAPITAL'], v: ['BUILD', 'PERSONAL', 'CAPITAL'], u: 3, lane: 2, kind: 'step' },
    { id: 's2', h: ['SUCCEED'], v: ['SUCCEED'], u: 4, lane: 1, kind: 'ok' },
];

const EDGES: [string, string][] = [
    ['root', 'dont'],
    ['root', 'try'],
    ['dont', 'f1'],
    ['try', 'f2'],
    ['try', 's1'],
    ['f2', 'b1'],
    ['s1', 'b2'],
    ['b1', 's2'],
];

const GHOST_OUT = ['f1', 'b2', 's2']; // nodes whose lines run off the far edge

type Orient = 'h' | 'v';

// Everything is laid out in real screen pixels so the drawing always fills the screen.
function layout(w: number, h: number) {
    const orient: Orient = w < 640 ? 'v' : 'h';
    const p: Record<string, { x: number; y: number }> = {};
    NODES.forEach((n) => {
        if (orient === 'h') {
            const colX = [0.085, 0.265, 0.445, 0.625, 0.8][n.u];
            p[n.id] = { x: colX * w, y: (0.18 + n.lane * 0.29) * h };
        } else {
            const rowY = [0.07, 0.22, 0.37, 0.54, 0.71][n.u];
            p[n.id] = { x: (0.16 + n.lane * 0.34) * w, y: rowY * h };
        }
    });
    const clamp = (a: number, v: number, b: number) => Math.max(a, Math.min(b, v));
    const R = orient === 'h' ? clamp(22, w * 0.027, 48) : clamp(15, w * 0.045, 20);
    const fs = orient === 'h' ? clamp(12, w * 0.0105, 19) : 11.5;
    const ls = fs * 0.22;
    const labelGap = R + (orient === 'h' ? fs * 1.3 : 16);
    return { orient, p, R, fs, ls, labelGap, lh: fs * 1.35, lineW: orient === 'h' ? 2.2 : 2 };
}

// Colours come from the site palette: orange accent, warm beige text.
// "Fail" nodes stay quiet and grey-beige, "succeed" nodes glow orange.
const palette = (hot: boolean, kind: Kind) => {
    if (hot) return { ring: '#ffb59f', dot: '#ffd9cc', text: '#f1e6d4', inner: BG, halo: 0.3 };
    if (kind === 'fail')
        return { ring: 'rgba(183,171,152,0.5)', dot: 'rgba(183,171,152,0.5)', text: 'rgba(183,171,152,0.5)', inner: BG, halo: 0.07 };
    if (kind === 'ok')
        return { ring: '#f06f52', dot: '#ff8f73', text: '#f06f52', inner: `rgba(${ACC},0.2)`, halo: 0.2 };
    return { ring: '#eb5939', dot: '#f06f52', text: '#b7ab98', inner: BG, halo: 0.14 };
};

function TreeSVG({ w, h, hot }: { w: number; h: number; hot: boolean }) {
    const { orient, p, R, fs, ls, labelGap, lh, lineW } = layout(w, h);
    const FAR = 4000;
    const maskId = `gap-${hot ? 'hot' : 'base'}`;
    const lineColor = hot ? '#ffb59f' : `rgba(${ACC},0.8)`;
    const ghostColor = `rgba(${ACC},0.3)`;
    const dotR = R * 0.3;

    // small gaps in the lines behind each label, so text needs no outline
    const boxes = NODES.map((n) => {
        const lines = orient === 'h' ? n.h : n.v;
        const { x, y } = p[n.id];
        const chars = Math.max(...lines.map((t) => t.length));
        const bw = chars * (fs * 0.7 + ls) + 22;
        const bottom = y - labelGap + fs * 0.35 + 5;
        const top = y - labelGap - (lines.length - 1) * lh - fs * 0.9 - 5;
        return { x: x - bw / 2, y: top, w: bw, h: bottom - top };
    });

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" overflow="visible" aria-hidden>
            <defs>
                <mask id={maskId} maskUnits="userSpaceOnUse" x={-FAR} y={-FAR} width={FAR * 2} height={FAR * 2}>
                    <rect x={-FAR} y={-FAR} width={FAR * 2} height={FAR * 2} fill="#fff" />
                    {boxes.map((b, i) => (
                        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={6} fill="#000" />
                    ))}
                </mask>
            </defs>
            <g mask={`url(#${maskId})`}>
                {/* lines entering from one edge and running off to the other */}
                {!hot && (
                    <>
                        <path
                            d={orient === 'h' ? `M ${-FAR} ${p.root.y} L ${p.root.x} ${p.root.y}` : `M ${p.root.x} ${-FAR} L ${p.root.x} ${p.root.y}`}
                            fill="none"
                            stroke={ghostColor}
                            strokeWidth={1.6}
                        />
                        {GHOST_OUT.map((id) => (
                            <path
                                key={id}
                                d={orient === 'h' ? `M ${p[id].x} ${p[id].y} L ${FAR} ${p[id].y}` : `M ${p[id].x} ${p[id].y} L ${p[id].x} ${FAR}`}
                                fill="none"
                                stroke={ghostColor}
                                strokeWidth={1.6}
                            />
                        ))}
                    </>
                )}
                {/* straight connections */}
                {EDGES.map(([a, b]) => (
                    <path
                        key={a + b}
                        d={`M ${p[a].x} ${p[a].y} L ${p[b].x} ${p[b].y}`}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth={hot ? lineW + 0.8 : lineW}
                        strokeLinecap="round"
                    />
                ))}
            </g>
            {NODES.map((n) => {
                const { x, y } = p[n.id];
                const c = palette(hot, n.kind);
                const lines = orient === 'h' ? n.h : n.v;
                return (
                    <g key={n.id}>
                        <circle cx={x} cy={y} r={R + 12} fill="none" stroke={c.ring} strokeOpacity={c.halo} strokeWidth={8} />
                        <circle cx={x} cy={y} r={R} fill={c.inner} stroke={c.ring} strokeWidth={orient === 'h' ? 2.6 : 2.2} />
                        <circle cx={x} cy={y} r={dotR} fill={c.dot} />
                        {lines.map((t, i) => (
                            <text
                                key={i}
                                x={x}
                                y={y - labelGap - (lines.length - 1 - i) * lh}
                                textAnchor="middle"
                                fill={c.text}
                                fontSize={fs}
                                letterSpacing={ls}
                                className="font-syne"
                                style={{ fontWeight: 500 }}
                            >
                                {t}
                            </text>
                        ))}
                    </g>
                );
            })}
        </svg>
    );
}

export default function Loader({ onComplete }: LoaderProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const numRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const baseRef = useRef<HTMLDivElement>(null);
    const hotRef = useRef<HTMLDivElement>(null);
    const horizontalRef = useRef(true);
    const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

    // measure the screen (and re-measure on resize / rotate)
    useEffect(() => {
        const measure = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            horizontalRef.current = w >= 640;
            setDims({ w, h });
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    useEffect(() => {
        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const k = reduce ? 0.35 : 1;
        let tl: gsap.core.Timeline | null = null;
        let cancelled = false;

        const paint = (p: number) => {
            const n = Math.max(0, Math.min(100, p));
            const horizontal = horizontalRef.current;
            if (numRef.current) numRef.current.textContent = String(Math.round(n));
            if (barRef.current) barRef.current.style.width = `${n}%`;
            // the soft glow rides just behind the drawing's leading edge and gently narrows to
            // nothing as the count reaches 100 (it never fades in and out, and never leads)
            const nHot = (n * (100 + BAND)) / 100;
            const to = n;
            const from = Math.min(Math.max(nHot - BAND, 0), n);
            if (baseRef.current)
                baseRef.current.style.clipPath = horizontal ? `inset(0 ${100 - n}% 0 0)` : `inset(0 0 ${100 - n}% 0)`;
            if (hotRef.current) {
                const el = hotRef.current;
                el.style.clipPath = horizontal ? `inset(0 ${100 - to}% 0 0)` : `inset(0 0 ${100 - to}% 0)`;
                const soft = `linear-gradient(${horizontal ? 'to right' : 'to bottom'}, transparent ${from}%, #000 ${Math.min(from + BAND * 0.9, 100)}%)`;
                el.style.maskImage = soft;
                el.style.webkitMaskImage = soft;
            }
        };
        paint(0);

        const start = () => {
            if (cancelled) return;
            const state = { p: 0 };
            tl = gsap.timeline({
                onComplete: () => {
                    // short hold on 100%, then the whole screen slides up
                    gsap.to(rootRef.current, {
                        yPercent: -100,
                        duration: 0.95 * k + 0.05,
                        delay: 0.7 * k,
                        ease: 'power4.inOut',
                        onComplete,
                    });
                },
            });
            // slow start, then a quick burst that eases out towards 100
            tl.to(state, { p: 8, duration: 0.5 * k, ease: 'none', onUpdate: () => paint(state.p) }, 0.2 * k);
            tl.to(state, { p: 100, duration: 2.1 * k, ease: 'power3.out', onUpdate: () => paint(state.p) });
        };

        // wait for the site font so the labels don't change shape mid-animation
        const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
        Promise.race([
            fonts ? fonts.ready.then(() => undefined) : Promise.resolve(),
            new Promise<void>((res) => setTimeout(res, 1500)),
        ]).then(start);

        return () => {
            cancelled = true;
            tl?.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onComplete]);

    return (
        <div ref={rootRef} className="fixed inset-0 z-[9000] overflow-hidden" style={{ background: 'var(--bg, #0d0d0d)' }} aria-label="Loading">
            {/* soft warm glow and a faint grid */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(900px 620px at 78% 6%, rgba(${ACC},0.07), transparent 62%), radial-gradient(700px 500px at 8% 100%, rgba(${ACC},0.05), transparent 65%)`,
                }}
            />
            <div
                className="absolute inset-0 opacity-[0.6]"
                style={{
                    backgroundImage: `linear-gradient(rgba(${ACC},0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(${ACC},0.04) 1px, transparent 1px)`,
                    backgroundSize: '64px 64px',
                    maskImage: 'radial-gradient(ellipse at 40% 45%, #000 20%, transparent 75%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at 40% 45%, #000 20%, transparent 75%)',
                }}
            />

            {/* the drawing, covering the whole screen */}
            <div
                ref={baseRef}
                className="absolute inset-0"
                style={{ filter: `drop-shadow(0 0 6px rgba(${ACC},0.35))`, clipPath: 'inset(0 100% 0 0)' }}
            >
                {dims && <TreeSVG w={dims.w} h={dims.h} hot={false} />}
            </div>
            <div
                ref={hotRef}
                className="absolute inset-0"
                style={{ filter: `drop-shadow(0 0 9px rgba(${ACC},0.85))`, clipPath: 'inset(0 100% 0 0)' }}
            >
                {dims && <TreeSVG w={dims.w} h={dims.h} hot />}
            </div>

            {/* counter */}
            <div className="absolute right-[6vw] bottom-[4vh] sm:bottom-[7vh] flex flex-col items-end">
                <div className="flex items-start">
                    <span
                        ref={numRef}
                        className="font-syne font-semibold leading-[0.9] tracking-[-0.045em] tabular-nums text-right"
                        style={{
                            fontSize: 'clamp(56px, 9.5vw, 160px)',
                            background: 'linear-gradient(180deg, #e8dcc6 12%, #7d7466 100%)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        0
                    </span>
                    <span className="font-syne font-medium text-[clamp(14px,1.6vw,24px)] mt-[0.4em] ml-2" style={{ color: `rgba(${ACC},0.85)` }}>
                        %
                    </span>
                </div>
                <span className="font-syne font-medium text-[10px] tracking-[0.5em] uppercase mt-4 mr-1" style={{ color: `rgba(${ACC},0.6)` }}>
                    Loading
                </span>
            </div>

            {/* site tag, bottom left */}
            <span
                className="absolute left-[6vw] bottom-[4vh] sm:bottom-[5vh] font-syne font-medium text-[10px] tracking-[0.3em] uppercase"
                style={{ color: 'var(--fg3, rgba(183,171,152,0.24))' }}
            >
                sadeepa.me | portfolio
            </span>

            {/* progress line (also the glowing edge while the screen slides up) */}
            <div className="absolute left-0 right-0 bottom-0 h-[2px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div
                    ref={barRef}
                    className="h-full"
                    style={{
                        width: '0%',
                        background: 'linear-gradient(90deg, #eb5939, #f06f52)',
                        boxShadow: `0 0 12px rgba(${ACC},0.65)`,
                    }}
                />
            </div>
        </div>
    );
}
