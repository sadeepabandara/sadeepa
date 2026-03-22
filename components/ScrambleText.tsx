'use client';
import { useEffect, useRef } from 'react';

const CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

interface ScrambleTextProps {
    text: string;
    trigger?: boolean; // start when true
    delay?: number; // ms delay before starting
    duration?: number; // ms total duration
    className?: string;
    style?: React.CSSProperties;
}

export default function ScrambleText({
    text,
    trigger = true,
    delay = 0,
    duration = 800,
    className,
    style,
}: ScrambleTextProps) {
    const elRef = useRef<HTMLSpanElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!trigger) return;
        const el = elRef.current;
        if (!el) return;

        let startTime: number | null = null;
        const letters = text.split('');

        const timer = setTimeout(() => {
            const animate = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // How many letters have settled
                const settled = Math.floor(progress * letters.length);

                el.textContent = letters
                    .map((char, i) => {
                        if (char === ' ') return ' ';
                        if (i < settled) return char;
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join('');

                if (progress < 1) {
                    rafRef.current = requestAnimationFrame(animate);
                } else {
                    el.textContent = text;
                }
            };
            rafRef.current = requestAnimationFrame(animate);
        }, delay);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(rafRef.current);
        };
    }, [trigger, text, delay, duration]);

    return (
        <span ref={elRef} className={className} style={style}>
            {text}
        </span>
    );
}
