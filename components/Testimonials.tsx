'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    text: string;
    initials: string;
}

const fallback: Testimonial[] = [
    {
        id: '1',
        initials: 'AK',
        name: 'Arjun Kapoor',
        role: 'Founder',
        company: 'Arcane Studio',
        text: 'Working with Sadeepa was one of the best decisions we made for our rebrand. He understood our vision before we could even articulate it — and delivered something that made our whole team emotional.',
    },
    {
        id: '2',
        initials: 'SR',
        name: 'Sofia Reyes',
        role: 'Head of Product',
        company: 'Velour',
        text: 'The attention to motion and micro-interactions was on another level. Our bounce rate dropped 40% after the redesign. The site just feels alive in a way no other agency has matched.',
    },
    {
        id: '3',
        initials: 'NP',
        name: 'Noah Park',
        role: 'CTO',
        company: 'Meridian',
        text: 'Delivered on time, on budget, and somehow still managed to exceed what we thought was possible. Rare combination of technical depth and real design taste. Would hire again in a heartbeat.',
    },
    {
        id: '4',
        initials: 'ML',
        name: 'Maya Lin',
        role: 'Creative Director',
        company: 'Noir',
        text: 'Most designers can make something look good. Few can make something feel like it belongs to your brand at a soul level. Sadeepa is in that second group. Phenomenal to work with.',
    },
];

interface TestimonialsProps {
    testimonials?: Testimonial[];
}

/* ─────────────────────────────────────────
   MARQUEE — infinite horizontal loop
   Pause on hover, fade edges
───────────────────────────────────────── */
function TestimonialsMarquee({
    testimonials,
}: {
    testimonials: Testimonial[];
}) {
    const trackRef = useRef<HTMLDivElement>(null);
    const animRef = useRef<gsap.core.Tween | null>(null);

    const items = [...testimonials, ...testimonials, ...testimonials];

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const singleSetWidth = track.scrollWidth / 3;

        animRef.current = gsap.to(track, {
            x: `-=${singleSetWidth}`,
            duration: singleSetWidth / 80,
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((x) => parseFloat(x) % singleSetWidth),
            },
        });

        return () => {
            animRef.current?.kill();
        };
    }, []);

    const pause = () => animRef.current?.pause();
    const resume = () => animRef.current?.resume();

    return (
        <div
            className="border-t py-16"
            style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
        >
            {/* Section header */}
            <div className="px-14 mb-10">
                <div
                    className="text-[10px] tracking-[0.38em] uppercase flex items-center gap-3 mb-4"
                    style={{ color: 'var(--or)' }}
                >
                    <span
                        className="w-[18px] h-px"
                        style={{ background: 'var(--or)' }}
                    />
                    Kind Words
                </div>
                <h2 className="text-[clamp(32px,4vw,60px)] font-extrabold leading-[.94] tracking-[-0.03em]">
                    What clients
                    <br />
                    <em
                        className="not-italic font-normal"
                        style={{ color: 'rgba(245,240,232,0.3)' }}
                    >
                        say.
                    </em>
                </h2>
            </div>

            {/* Scrolling strip */}
            <div
                className="relative overflow-hidden"
                onMouseEnter={pause}
                onMouseLeave={resume}
            >
                {/* Left fade */}
                <div
                    className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-32"
                    style={{
                        background:
                            'linear-gradient(to right, var(--bg) 0%, transparent 100%)',
                    }}
                />
                {/* Right fade */}
                <div
                    className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-32"
                    style={{
                        background:
                            'linear-gradient(to left, var(--bg) 0%, transparent 100%)',
                    }}
                />

                <div
                    ref={trackRef}
                    className="flex gap-5 will-change-transform"
                    style={{ width: 'max-content' }}
                >
                    {items.map((t, i) => (
                        <div
                            key={`${t.id}-${i}`}
                            className="relative flex-shrink-0 border overflow-hidden"
                            style={{
                                width: '420px',
                                background: 'var(--bg3)',
                                borderColor: 'rgba(245,240,232,0.06)',
                            }}
                        >
                            <div className="px-8 pt-8 pb-8">
                                {/* Quote mark — sits in flow so padding keeps it off the top edge */}
                                <span
                                    className="block select-none pointer-events-none font-extrabold leading-none mb-3"
                                    style={{
                                        fontSize: '72px',
                                        lineHeight: 1,
                                        color: 'var(--or-dim)',
                                        fontFamily: 'var(--font-syne)',
                                    }}
                                >
                                    &ldquo;
                                </span>

                                <p
                                    className="text-[14px] leading-[1.78] mb-7 font-light"
                                    style={{ color: 'rgba(245,240,232,0.6)' }}
                                >
                                    {t.text}
                                </p>

                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-extrabold border flex-shrink-0"
                                        style={{
                                            background: 'var(--or-dim)',
                                            borderColor: 'rgba(255,94,26,0.2)',
                                            color: 'var(--or)',
                                        }}
                                    >
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-bold">
                                            {t.name}
                                        </div>
                                        <div
                                            className="text-[11px] mt-0.5"
                                            style={{
                                                color: 'rgba(245,240,232,0.3)',
                                            }}
                                        >
                                            {t.role}, {t.company}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   MOBILE — simple stacked fade-up
───────────────────────────────────────── */
function MobileTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        cardsRef.current.forEach((card) => {
            if (!card) return;
            gsap.fromTo(
                card,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                },
            );
        });
    }, []);

    return (
        <div
            className="px-6 py-16 border-t"
            style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
        >
            <div
                className="text-[10px] tracking-[0.38em] uppercase mb-4 flex items-center gap-3"
                style={{ color: 'var(--or)' }}
            >
                <span
                    className="w-[18px] h-px"
                    style={{ background: 'var(--or)' }}
                />
                Kind Words
            </div>
            <h2 className="text-[clamp(32px,8vw,48px)] font-extrabold leading-[.94] tracking-[-0.03em] mb-10">
                What clients
                <br />
                <em
                    className="not-italic font-normal"
                    style={{ color: 'rgba(245,240,232,0.3)' }}
                >
                    say.
                </em>
            </h2>
            <div className="flex flex-col gap-5">
                {testimonials.map((t, i) => (
                    <div
                        key={t.id}
                        ref={(el) => {
                            cardsRef.current[i] = el;
                        }}
                        className="p-7 border"
                        style={{
                            background: 'var(--bg3)',
                            borderColor: 'rgba(245,240,232,0.05)',
                        }}
                    >
                        <span
                            className="block select-none pointer-events-none font-extrabold leading-none mb-3"
                            style={{
                                fontSize: '64px',
                                lineHeight: 1,
                                color: 'var(--or-dim)',
                                fontFamily: 'var(--font-syne)',
                            }}
                        >
                            &ldquo;
                        </span>
                        <p
                            className="text-[14px] leading-[1.75] mb-6"
                            style={{ color: 'rgba(245,240,232,0.5)' }}
                        >
                            {t.text}
                        </p>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-extrabold border flex-shrink-0"
                                style={{
                                    background: 'var(--or-dim)',
                                    borderColor: 'rgba(255,94,26,0.2)',
                                    color: 'var(--or)',
                                }}
                            >
                                {t.initials}
                            </div>
                            <div>
                                <div className="text-[13px] font-bold">
                                    {t.name}
                                </div>
                                <div
                                    className="text-[11px] mt-0.5"
                                    style={{ color: 'rgba(245,240,232,0.3)' }}
                                >
                                    {t.role}, {t.company}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
export default function Testimonials({
    testimonials = fallback,
}: TestimonialsProps) {
    return (
        <section id="testimonials">
            <div className="hidden md:block">
                <TestimonialsMarquee testimonials={testimonials} />
            </div>
            <div className="md:hidden">
                <MobileTestimonials testimonials={testimonials} />
            </div>
        </section>
    );
}
