'use client';
import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 12;

export default function CursorTrail() {
    const dotsRef = useRef<HTMLDivElement[]>([]);
    const positions = useRef<{ x: number; y: number }[]>(
        Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })),
    );
    const mouseRef = useRef({ x: -100, y: -100 });
    const rafRef = useRef(0);

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

        const onMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', onMove);

        const animate = () => {
            // Lead dot follows mouse
            positions.current[0] = { ...mouseRef.current };
            // Each trailing dot follows the one before it
            for (let i = 1; i < TRAIL_LENGTH; i++) {
                const prev = positions.current[i - 1];
                const cur = positions.current[i];
                positions.current[i] = {
                    x: cur.x + (prev.x - cur.x) * 0.35,
                    y: cur.y + (prev.y - cur.y) * 0.35,
                };
            }
            // Apply to DOM
            dotsRef.current.forEach((dot, i) => {
                if (!dot) return;
                const { x, y } = positions.current[i];
                const scale = 1 - i / TRAIL_LENGTH;
                const opacity = (1 - i / TRAIL_LENGTH) * 0.35;
                dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
                dot.style.opacity = String(opacity);
            });
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
            {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        if (el) dotsRef.current[i] = el;
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#ff5e1a',
                        opacity: 0,
                        willChange: 'transform, opacity',
                        pointerEvents: 'none',
                    }}
                />
            ))}
        </div>
    );
}
