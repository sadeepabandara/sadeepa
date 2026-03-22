'use client';
import { useRef } from 'react';
import gsap from 'gsap';

const items = [
    'UI Design',
    'Web Development',
    'Brand Identity',
    'Motion Design',
    'Creative Direction',
    '3D & Immersive',
    'UI Design',
    'Web Development',
    'Brand Identity',
    'Motion Design',
    'Creative Direction',
    '3D & Immersive',
];

export default function Ticker() {
    const trackRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);

    const handleMouseEnter = () => {
        // Slow down on hover
        if (tweenRef.current)
            gsap.to(tweenRef.current, {
                timeScale: 0.15,
                duration: 0.6,
                ease: 'power2.out',
            });
    };

    const handleMouseLeave = () => {
        // Speed back up
        if (tweenRef.current)
            gsap.to(tweenRef.current, {
                timeScale: 1,
                duration: 0.8,
                ease: 'power2.inOut',
            });
    };

    // Start the marquee tween once ref is available
    const setTrack = (el: HTMLDivElement | null) => {
        (trackRef as any).current = el;
        if (!el || tweenRef.current) return;
        tweenRef.current = gsap.to(el, {
            xPercent: -50,
            duration: 22,
            ease: 'none',
            repeat: -1,
        });
    };

    return (
        <div
            className="border-t border-b overflow-hidden bg-bg2 py-6"
            style={{ borderColor: 'var(--line)' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div ref={setTrack} className="ticker-track flex w-max">
                {items.map((item, i) => (
                    <span
                        key={i}
                        className="text-[32px] md:text-[42px] font-extrabold tracking-[-0.01em] uppercase px-16 whitespace-nowrap flex items-center transition-all duration-300"
                        style={{
                            WebkitTextStroke: '1.5px rgba(245,240,232,0.25)',
                            color: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                            (
                                e.currentTarget as HTMLElement
                            ).style.webkitTextStroke = '1.5px #ff5e1a';
                        }}
                        onMouseLeave={(e) => {
                            (
                                e.currentTarget as HTMLElement
                            ).style.webkitTextStroke =
                                '1.5px rgba(245,240,232,0.25)';
                        }}
                    >
                        {item}
                        <span
                            className="ml-16 text-[14px]"
                            style={{
                                color: 'rgba(255,94,26,0.5)',
                                WebkitTextStroke: '0',
                            }}
                        >
                            ◆
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );
}
