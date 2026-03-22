'use client';
import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
    value: string; // e.g. "20+" or "3+"
    duration?: number;
    className?: string;
}

export default function CountUp({
    value,
    duration = 1800,
    className,
}: CountUpProps) {
    const [display, setDisplay] = useState('0');
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Extract number and suffix (e.g. "20+" → 20, "+")
        const match = value.match(/^(\d+)(.*)$/);
        if (!match) {
            setDisplay(value);
            return;
        }

        const target = parseInt(match[1]);
        const suffix = match[2];

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    let startTime: number | null = null;

                    const animate = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min(
                            (timestamp - startTime) / duration,
                            1,
                        );
                        // Ease out
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);
                        setDisplay(`${current}${suffix}`);
                        if (progress < 1) requestAnimationFrame(animate);
                        else setDisplay(value);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [value, duration]);

    return (
        <span ref={ref} className={className}>
            {display}
        </span>
    );
}
