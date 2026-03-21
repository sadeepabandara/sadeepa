'use client';
import { useRef } from 'react';
import gsap from 'gsap';

export default function SignatureTag() {
    const codeByRef = useRef<HTMLSpanElement>(null);
    const nameRef = useRef<HTMLSpanElement>(null);
    const bandaraRef = useRef<HTMLSpanElement>(null);

    const onEnter = () => {
        gsap.killTweensOf([
            codeByRef.current,
            nameRef.current,
            bandaraRef.current,
        ]);

        // Measure "Code by " width so name block slides exactly that far
        const shift = codeByRef.current
            ? codeByRef.current.getBoundingClientRect().width + 4
            : 52;

        // "Code by" fades + slides out left
        gsap.to(codeByRef.current, {
            x: -16,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
        });

        // Whole "Sadeepa Bandara" block slides left together
        gsap.to(nameRef.current, {
            x: -shift,
            duration: 0.42,
            ease: 'power3.out',
            delay: 0.08,
        });

        // "Bandara" reveals via clipPath (no x movement — stays in place relative to name block)
        gsap.fromTo(
            bandaraRef.current,
            { clipPath: 'inset(0 100% 0 0)' },
            {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.38,
                ease: 'power3.out',
                delay: 0.18,
            },
        );
    };

    const onLeave = () => {
        gsap.killTweensOf([
            codeByRef.current,
            nameRef.current,
            bandaraRef.current,
        ]);

        // "Bandara" hides
        gsap.to(bandaraRef.current, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.25,
            ease: 'power2.in',
        });

        // Name block slides back right
        gsap.to(nameRef.current, {
            x: 0,
            duration: 0.38,
            ease: 'power3.out',
            delay: 0.05,
        });

        // "Code by" comes back
        gsap.to(codeByRef.current, {
            x: 0,
            opacity: 1,
            duration: 0.38,
            ease: 'power2.out',
            delay: 0.1,
        });
    };

    return (
        <span
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="inline-flex items-center cursor-none select-none"
            style={{ fontFamily: 'var(--font-syne), sans-serif' }}
        >
            {/* © — never moves */}
            <span
                className="text-[11px] font-semibold"
                style={{
                    color: 'rgba(245,240,232,0.3)',
                    marginRight: 5,
                    flexShrink: 0,
                }}
            >
                ©
            </span>

            {/* "Code by" — slides out left */}
            <span
                ref={codeByRef}
                className="text-[11px] tracking-[0.12em] uppercase font-semibold"
                style={{
                    color: 'rgba(245,240,232,0.3)',
                    marginRight: 5,
                    display: 'inline-block',
                    willChange: 'transform, opacity',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}
            >
                Code by
            </span>

            {/* "Sadeepa Bandara" — slides left as one block */}
            <span
                ref={nameRef}
                className="inline-flex items-center"
                style={{
                    position: 'relative',
                    willChange: 'transform',
                    flexShrink: 0,
                }}
            >
                <span
                    className="text-[14px] font-bold tracking-[0.12em] uppercase"
                    style={{
                        color: 'rgba(245,240,232,0.85)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Sadeepa
                </span>

                {/* Bandara — absolutely positioned so no blank space in layout */}
                <span
                    ref={bandaraRef}
                    className="text-[14px] font-bold tracking-[0.12em] uppercase"
                    style={{
                        color: '#ff5e1a',
                        clipPath: 'inset(0 100% 0 0)',
                        position: 'absolute',
                        left: 'calc(100% + 5px)',
                        top: 0,
                        willChange: 'clip-path',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Bandara
                </span>
            </span>
        </span>
    );
}
