'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface QuoteData {
    text: string;
    author: string;
}

interface QuoteProps {
    data?: QuoteData | null;
    onCursorVisibilityChange?: (visible: boolean) => void;
}

const fallback: QuoteData = {
    text: 'Rule No. 1 : Never lose money. Rule No. 2 : Never forget Rule No. 1.',
    author: 'Warren Buffett',
};

export default function Quote({ data, onCursorVisibilityChange }: QuoteProps) {
    const d = data ?? fallback;
    const sectionRef = useRef<HTMLElement>(null);
    const quoteRef = useRef<HTMLParagraphElement>(null);
    const lastPointerRef = useRef({ x: -9999, y: -9999 });

    // Mask cursor state
    const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
    const [isInsideQuote, setIsInsideQuote] = useState(false);
    const maskSize = !isInsideQuote ? 0 : 400;

    // Track mouse relative to the section element and respond to scroll/resize
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const updateFromClientPoint = (clientX: number, clientY: number) => {
            const sectionRect = section.getBoundingClientRect();
            setMouse({ x: clientX - sectionRect.left, y: clientY - sectionRect.top });

            const quoteRect = quoteRef.current?.getBoundingClientRect();
            if (!quoteRect) {
                setIsInsideQuote(false);
                onCursorVisibilityChange?.(true);
                return;
            }

            const insideQuote =
                clientX >= quoteRect.left &&
                clientX <= quoteRect.right &&
                clientY >= quoteRect.top &&
                clientY <= quoteRect.bottom;

            setIsInsideQuote(insideQuote);
            onCursorVisibilityChange?.(!insideQuote);
        };

        const onSectionMouseMove = (e: MouseEvent) => {
            lastPointerRef.current.x = e.clientX;
            lastPointerRef.current.y = e.clientY;
            updateFromClientPoint(e.clientX, e.clientY);
        };

        const onScrollOrResize = () => {
            const { x, y } = lastPointerRef.current;
            if (x === -9999 || y === -9999) return;
            updateFromClientPoint(x, y);
        };

        const onLeave = () => {
            setIsInsideQuote(false);
            onCursorVisibilityChange?.(true);
        };

        section.addEventListener('mousemove', onSectionMouseMove);
        section.addEventListener('mouseleave', onLeave);
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);

        return () => {
            section.removeEventListener('mousemove', onSectionMouseMove);
            section.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('scroll', onScrollOrResize);
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, []);

    // Scroll-fill on body layer
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const fills = Array.from(
            section.querySelectorAll<HTMLElement>('.q-word-fill'),
        );
        const total = fills.length;
        if (total === 0) return;
        const st = ScrollTrigger.create({
            trigger: section,
            start: 'top 75%',
            end: 'bottom 75%',
            scrub: 1.2,
            onUpdate: (self) => {
                const p = self.progress;
                fills.forEach((fill, i) => {
                    const wordStart = i / total;
                    const wordEnd = (i + 1) / total;
                    const progress = Math.max(
                        0,
                        Math.min(1, (p - wordStart) / (wordEnd - wordStart)),
                    );
                    fill.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
                });
            },
        });
        return () => st.kill();
    }, [d.text]);

    const words = d.text.split(' ');
    // Different quote shown inside the mask reveal
    const innerQuote = 'Be Fearful When Others Are Greedy and Greedy When Others Are Fearful.';

    // Shared typography styles — must be identical on both layers
    const textStyle: React.CSSProperties = {
        fontSize: 'clamp(22px, 3.8vw, 52px)',
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: '-0.025em',
    };

    return (
        <section
            ref={sectionRef}
            id="quote"
            className="relative overflow-hidden bg-bg border-b"
            style={{ borderColor: 'var(--line)' }}
        >
            {/* ══════════════════════════════════════════════
                BODY LAYER — dim ghost + scroll-reveal to fg
            ══════════════════════════════════════════════ */}
            <div className="px-6 md:px-14 py-20 md:py-32">
                <div className="max-w-5xl mx-auto">

                    <div className="font-extrabold mb-2 -ml-2" style={{
                        color: 'rgba(255,94,26,0.15)',
                        lineHeight: 0.8,
                        fontSize: 'clamp(64px, 8vw, 96px)',
                        userSelect: 'none',
                    }}>"</div>

                    <p
                        ref={quoteRef}
                        className="mb-10 flex flex-wrap"
                        style={{ ...textStyle, gap: '0 0.28em' }}
                    >
                        {words.map((word, i) => (
                            <span key={i} className="inline-block relative" style={{ lineHeight: 'inherit' }}>
                                {/* Ghost dim layer */}
                                <span style={{ color: 'rgba(245,240,232,0.10)', display: 'block', whiteSpace: 'pre', userSelect: 'none' }}>
                                    {word}
                                </span>
                                {/* Scroll-revealed bright layer */}
                                <span className="q-word-fill" style={{
                                    color: 'var(--fg)',
                                    position: 'absolute', top: 0, left: 0,
                                    whiteSpace: 'pre',
                                    clipPath: 'inset(0 100% 0 0)',
                                    willChange: 'clip-path',
                                }}>
                                    {word}
                                </span>
                            </span>
                        ))}
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="w-10 h-px block flex-shrink-0" style={{ background: 'rgba(255,94,26,0.5)' }} />
                        <span className="font-syne tracking-[0.22em] uppercase" style={{ color: 'rgba(255,94,26,0.7)', fontSize: '11px' }}>
                            {d.author}
                        </span>
                    </div>

                </div>
            </div>

            {/* ══════════════════════════════════════════════
                MASK LAYER — orange bg, black text.
                Absolutely covers body layer. WebkitMask punches
                a circle around the cursor revealing this layer.
                Padding structure mirrors body layer exactly.
            ══════════════════════════════════════════════ */}
            <motion.div
                className="absolute inset-0 z-10"
                animate={{
                    WebkitMaskPosition: `${mouse.x - maskSize / 2}px ${mouse.y - maskSize / 2}px`,
                    WebkitMaskSize: `${maskSize}px`,
                } as any}
                transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
                style={{
                    WebkitMaskImage: "url('/mask.svg')",
                    maskImage: "url('/mask.svg')",
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    backgroundColor: 'var(--or)',
                }}
            >
                {/* Exact same padding wrapper + max-width wrapper as body layer */}
                <div className="px-6 md:px-14 py-20 md:py-32">
                    <div className="max-w-5xl mx-auto">

                        <div className="font-extrabold mb-2 -ml-2" style={{
                            color: '#000',
                            lineHeight: 0.8,
                            fontSize: 'clamp(64px, 8vw, 96px)',
                            userSelect: 'none',
                            opacity: 0.3,
                        }}>"</div>

                        {/* Different quote inside the mask — expands when cursor is inside quote bounds */}
                        <p
                            className="mb-10 flex flex-wrap"
                            style={{ ...textStyle, gap: '0 0.28em', color: '#000' }}
                        >
                            {innerQuote.split(' ').map((word, i) => (
                                <span key={i} className="inline-block" style={{ whiteSpace: 'pre', lineHeight: 'inherit' }}>
                                    {word}
                                </span>
                            ))}
                        </p>

                        <div className="flex items-center gap-4">
                            <span className="w-10 h-px block flex-shrink-0" style={{ background: '#000' }} />
                            <span className="font-syne tracking-[0.22em] uppercase" style={{ color: '#000', fontSize: '11px' }}>
                                Warren Buffett
                            </span>
                        </div>

                    </div>
                </div>
            </motion.div>
        </section>
    );
}
