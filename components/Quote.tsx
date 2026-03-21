'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface QuoteData {
    text: string;
    author: string;
}

const fallback: QuoteData = {
    text: 'Rule No. 1 : Never lose money. Rule No. 2 : Never forget Rule No. 1.',
    author: 'Warren Buffett',
};

export default function Quote({ data }: { data?: QuoteData | null }) {
    const d = data ?? fallback;
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const words = Array.from(
            section.querySelectorAll<HTMLElement>('.q-word'),
        );
        const attr = section.querySelector<HTMLElement>('.q-attr');
        const triggers: ScrollTrigger[] = [];

        words.forEach((word, i) => {
            const st = ScrollTrigger.create({
                trigger: section,
                start: 'top 85%',
                end: 'top 20%',
                scrub: 1.5,
                onUpdate: (self) => {
                    const wordOffset = (i / words.length) * 0.5;
                    const progress = Math.max(
                        0,
                        Math.min(
                            1,
                            (self.progress - wordOffset) / (1 - wordOffset),
                        ),
                    );
                    gsap.set(word, {
                        opacity: progress,
                        y: (1 - progress) * 36,
                    });
                },
            });
            triggers.push(st);
        });

        if (attr) {
            const stAttr = ScrollTrigger.create({
                trigger: section,
                start: 'top 50%',
                end: 'top 15%',
                scrub: 1.5,
                onUpdate: (self) => {
                    gsap.set(attr, {
                        opacity: self.progress,
                        y: (1 - self.progress) * 20,
                    });
                },
            });
            triggers.push(stAttr);
        }

        return () => {
            triggers.forEach((t) => t.kill());
        };
    }, [d.text]); // re-run if quote text changes

    return (
        <section
            ref={sectionRef}
            className="px-6 md:px-14 py-20 md:py-28 bg-bg border-b"
            style={{ borderColor: 'var(--line)' }}
        >
            <div className="max-w-5xl mx-auto">
                <div
                    className="font-extrabold mb-2 -ml-2"
                    style={{
                        color: 'rgba(255,94,26,0.18)',
                        lineHeight: 0.8,
                        fontSize: 'clamp(64px, 8vw, 96px)',
                    }}
                >
                    "
                </div>

                <p
                    className="font-extrabold leading-[1.15] tracking-[-0.025em] mb-8 flex flex-wrap gap-y-1"
                    style={{
                        fontSize: 'clamp(22px, 3.8vw, 52px)',
                        gap: '0 0.28em',
                    }}
                >
                    {d.text.split(' ').map((word, i) => (
                        <span
                            key={i}
                            className="q-word inline-block"
                            style={{
                                opacity: 0,
                                transform: 'translateY(36px)',
                                willChange: 'transform, opacity',
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </p>

                <div
                    className="q-attr flex items-center gap-4"
                    style={{
                        opacity: 0,
                        transform: 'translateY(20px)',
                        willChange: 'transform, opacity',
                    }}
                >
                    <span
                        className="w-10 h-px"
                        style={{ background: 'rgba(255,94,26,0.5)' }}
                    />
                    <span
                        className="font-mono tracking-[0.22em] uppercase"
                        style={{
                            color: 'rgba(255,94,26,0.7)',
                            fontSize: '11px',
                        }}
                    >
                        {d.author}
                    </span>
                </div>
            </div>
        </section>
    );
}
