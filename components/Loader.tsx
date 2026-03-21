'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LoaderProps {
    onComplete: () => void;
}

/* ─── Simplified but BIGGER roadmap ───────────────────────────────────────
   Two clear tracks: FRONTEND (left) and BACKEND (right)
   Bigger nodes, bigger text, easy to read at a glance
   ViewBox: 1400 × 520
──────────────────────────────────────────────────────────────────────────── */

const NODES = [
    // ── FRONTEND ────────────────────────────────────────────────
    { id: 'html', label: 'HTML', x: 80, y: 120, type: 'step' },
    { id: 'css', label: 'CSS', x: 240, y: 120, type: 'step' },
    { id: 'js', label: 'JavaScript', x: 420, y: 120, type: 'step' },
    { id: 'cp1', label: 'Static Pages', x: 160, y: 220, type: 'checkpoint' },
    { id: 'cp2', label: 'Interactivity', x: 380, y: 220, type: 'checkpoint' },
    { id: 'react', label: 'React', x: 160, y: 320, type: 'step' },
    { id: 'tailwind', label: 'Tailwind', x: 340, y: 320, type: 'step' },
    { id: 'next', label: 'Next.js', x: 520, y: 320, type: 'step' },
    { id: 'cp3', label: 'Frontend Apps', x: 340, y: 420, type: 'checkpoint' },

    // ── BACKEND ─────────────────────────────────────────────────
    { id: 'node', label: 'Node.js', x: 760, y: 120, type: 'step' },
    { id: 'rest', label: 'REST APIs', x: 960, y: 120, type: 'step' },
    { id: 'cp4', label: 'Server Layer', x: 860, y: 220, type: 'checkpoint' },
    { id: 'jwt', label: 'JWT Auth', x: 720, y: 320, type: 'step' },
    { id: 'redis', label: 'Redis', x: 880, y: 320, type: 'step' },
    { id: 'pg', label: 'PostgreSQL', x: 1040, y: 320, type: 'step' },
    { id: 'cp5', label: 'Database Layer', x: 880, y: 420, type: 'checkpoint' },

    // ── DEVOPS ──────────────────────────────────────────────────
    { id: 'docker', label: 'Docker', x: 1160, y: 120, type: 'step' },
    { id: 'aws', label: 'AWS', x: 1300, y: 120, type: 'step' },
    { id: 'cp6', label: 'Deployment', x: 1230, y: 220, type: 'checkpoint' },
    { id: 'ghact', label: 'GitHub Actions', x: 1160, y: 320, type: 'step' },
    { id: 'cp7', label: 'CI / CD', x: 1230, y: 420, type: 'checkpoint' },
];

const EDGES: [string, string][] = [
    ['html', 'cp1'],
    ['css', 'cp1'],
    ['js', 'cp2'],
    ['cp1', 'react'],
    ['cp2', 'react'],
    ['cp2', 'tailwind'],
    ['react', 'cp3'],
    ['tailwind', 'cp3'],
    ['next', 'cp3'],
    ['node', 'cp4'],
    ['rest', 'cp4'],
    ['cp4', 'jwt'],
    ['cp4', 'redis'],
    ['cp4', 'pg'],
    ['jwt', 'cp5'],
    ['redis', 'cp5'],
    ['pg', 'cp5'],
    ['docker', 'cp6'],
    ['aws', 'cp6'],
    ['cp6', 'ghact'],
    ['ghact', 'cp7'],
];

const NODE_ORDER = [...NODES]
    .sort((a, b) => a.x - b.x || a.y - b.y)
    .map((n) => n.id);

export default function Loader({ onComplete }: LoaderProps) {
    const loaderRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const nodeEls: Record<string, Element> = {};
        const edgeEls: Record<string, SVGPathElement[]> = {};

        svg.querySelectorAll('[data-node]').forEach((el) => {
            nodeEls[el.getAttribute('data-node')!] = el;
        });
        svg.querySelectorAll('[data-edge]').forEach((el) => {
            const key = el.getAttribute('data-edge')!;
            if (!edgeEls[key]) edgeEls[key] = [];
            edgeEls[key].push(el as SVGPathElement);
        });

        Object.values(nodeEls).forEach((el) => gsap.set(el, { opacity: 0 }));
        Object.values(edgeEls).forEach((arr) =>
            arr.forEach((el) => gsap.set(el, { opacity: 0 })),
        );

        // Show SVG now that everything is hidden
        svg.style.visibility = 'visible';

        const STEP = 0.1;
        const totalNodes = NODE_ORDER.length;

        const tl = gsap.timeline({
            onComplete: () => {
                setPercent(100);
                setTimeout(() => {
                    gsap.to(loaderRef.current, {
                        yPercent: -100,
                        duration: 1.1,
                        ease: 'power4.inOut',
                        onComplete,
                    });
                }, 600);
            },
        });

        NODE_ORDER.forEach((id, i) => {
            const el = nodeEls[id];
            if (!el) return;
            const t = i * STEP;

            tl.to(el, { opacity: 1, duration: 0.28, ease: 'power2.out' }, t);
            tl.call(
                () => setPercent(Math.round(((i + 1) / totalNodes) * 95)),
                [],
                t,
            );

            EDGES.filter(([from]) => from === id).forEach(([from, to]) => {
                const eArr = edgeEls[`${from}-${to}`];
                if (eArr)
                    eArr.forEach((e) =>
                        tl.to(e, { opacity: 0.5, duration: 0.3 }, t + 0.1),
                    );
            });
        });

        const totalTime = NODE_ORDER.length * STEP + 0.3;
        tl.to(
            Object.values(nodeEls),
            { opacity: 0.15, duration: 0.6, stagger: 0.01 },
            totalTime,
        );
        tl.to(
            Object.values(edgeEls).flat(),
            { opacity: 0.04, duration: 0.4 },
            totalTime,
        );
        const lastEl = nodeEls['cp7'];
        if (lastEl)
            tl.to(lastEl, { opacity: 1, duration: 0.4 }, totalTime + 0.2);

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    const nodeMap: Record<string, { x: number; y: number }> = {};
    NODES.forEach((n) => {
        nodeMap[n.id] = { x: n.x, y: n.y };
    });

    const VW = 1400,
        VH = 520;

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-[9000] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'var(--bg)' }}
        >
            {/* Title + percentage */}
            <div className="flex flex-col items-center gap-2 mb-6 z-10">
                <div className="flex items-center gap-3">
                    <span
                        className="font-mono text-[11px] tracking-[0.4em] uppercase"
                        style={{ color: 'rgba(255,94,26,0.6)' }}
                    >
                        Loading
                    </span>
                    <span
                        className="font-mono text-[11px] tracking-[0.1em]"
                        style={{ color: '#ff5e1a' }}
                    >
                        {percent}%
                    </span>
                </div>
                <span
                    className="text-[12px] tracking-[0.2em] uppercase font-semibold"
                    style={{ color: 'rgba(245,240,232,0.18)' }}
                >
                    Full Stack Roadmap
                </span>
            </div>

            {/* SVG */}
            <div
                className="w-full flex items-center justify-center"
                style={{ padding: '0 20px' }}
            >
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${VW} ${VH}`}
                    style={{
                        width: 'min(1360px, 96vw)',
                        height: 'auto',
                        maxHeight: 'calc(100vh - 180px)',
                        visibility: 'hidden',
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Dividers */}
                    <line
                        x1="640"
                        y1="20"
                        x2="640"
                        y2={VH - 20}
                        stroke="rgba(255,94,26,0.06)"
                        strokeWidth="1"
                        strokeDasharray="5 5"
                    />
                    <line
                        x1="1100"
                        y1="20"
                        x2="1100"
                        y2={VH - 20}
                        stroke="rgba(255,94,26,0.06)"
                        strokeWidth="1"
                        strokeDasharray="5 5"
                    />

                    {/* Section labels */}
                    {[
                        { label: 'FRONTEND', cx: 320 },
                        { label: 'BACKEND', cx: 870 },
                        { label: 'DEVOPS', cx: 1230 },
                    ].map(({ label, cx }) => (
                        <text
                            key={label}
                            x={cx}
                            y={30}
                            textAnchor="middle"
                            fontSize={13}
                            fontFamily="'Courier New', monospace"
                            fontWeight="700"
                            letterSpacing="0.3em"
                            fill="rgba(255,94,26,0.2)"
                        >
                            {label}
                        </text>
                    ))}

                    {/* Edges */}
                    {EDGES.map(([from, to]) => {
                        const a = nodeMap[from],
                            b = nodeMap[to];
                        if (!a || !b) return null;
                        const mx = (a.x + b.x) / 2,
                            my = (a.y + b.y) / 2;
                        return (
                            <path
                                key={`${from}-${to}`}
                                data-edge={`${from}-${to}`}
                                d={`M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`}
                                fill="none"
                                stroke="rgba(255,94,26,0.7)"
                                strokeWidth="1.5"
                                strokeDasharray="5 5"
                            />
                        );
                    })}

                    {/* Nodes */}
                    {NODES.map((n) => {
                        const isCP = n.type === 'checkpoint';
                        const w = isCP ? 160 : 130;
                        const h = isCP ? 34 : 30;
                        const rx = isCP ? 17 : 5;
                        const fs = isCP ? 11 : 11.5;

                        return (
                            <g
                                key={n.id}
                                data-node={n.id}
                                transform={`translate(${n.x - w / 2}, ${n.y - h / 2})`}
                            >
                                {isCP && (
                                    <rect
                                        x={-5}
                                        y={-5}
                                        width={w + 10}
                                        height={h + 10}
                                        rx={rx + 4}
                                        fill="rgba(255,94,26,0.07)"
                                    />
                                )}
                                <rect
                                    width={w}
                                    height={h}
                                    rx={rx}
                                    fill={
                                        isCP
                                            ? 'rgba(255,94,26,0.18)'
                                            : 'rgba(20,19,16,0.95)'
                                    }
                                    stroke={
                                        isCP
                                            ? 'rgba(255,94,26,0.7)'
                                            : 'rgba(255,94,26,0.3)'
                                    }
                                    strokeWidth={isCP ? 1.5 : 1}
                                />
                                <text
                                    x={w / 2}
                                    y={h / 2 + 1}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={fs}
                                    fontFamily="'Courier New', monospace"
                                    fontWeight={isCP ? '700' : '400'}
                                    letterSpacing="0.07em"
                                    fill={
                                        isCP
                                            ? 'rgba(255,94,26,0.95)'
                                            : 'rgba(245,240,232,0.85)'
                                    }
                                >
                                    {n.label.toUpperCase()}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Bottom label */}
            <div className="mt-5 flex items-center gap-3">
                <div
                    className="w-16 h-px"
                    style={{ background: 'rgba(255,94,26,0.2)' }}
                />
                <span
                    className="font-mono text-[11px] tracking-[0.25em] uppercase"
                    style={{ color: 'rgba(245,240,232,0.25)' }}
                >
                    sadeepa.me | portfolio
                </span>
                <div
                    className="w-16 h-px"
                    style={{ background: 'rgba(255,94,26,0.2)' }}
                />
            </div>
        </div>
    );
}
