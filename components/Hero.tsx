'use client';
import { useEffect, useRef, useState } from 'react';
import ScrambleText from '@/components/ScrambleText';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Magnetic button component
function MagneticBtn({
    href,
    children,
    solid = false,
}: {
    href: string;
    children: React.ReactNode;
    solid?: boolean;
}) {
    const ref = useRef<HTMLAnchorElement>(null);

    const onMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    };

    const onLeave = () => {
        gsap.to(ref.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.4)',
        });
    };

    return (
        <a
            ref={ref}
            href={href}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.14em] uppercase font-bold px-5 md:px-[26px] py-3 md:py-[14px] no-underline ${
                solid
                    ? 'bg-or text-bg hover:bg-or/90'
                    : 'border border-fg/15 text-fg hover:border-or hover:text-or'
            } transition-colors duration-300`}
        >
            {children}
        </a>
    );
}

interface HeroProps {
    animate: boolean;
}

export default function Hero({ animate }: HeroProps) {
    const imgRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const btnsRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!animate) return;
        const img = imgRef.current?.querySelector('img');
        if (img) {
            gsap.to(img, {
                scale: 1,
                duration: 2.4,
                ease: 'power3.out',
                delay: 0.05,
            });
        }
        document.querySelectorAll('.hero-line span').forEach((el, i) => {
            gsap.to(el, {
                y: '0%',
                duration: 1.15,
                ease: 'power4.out',
                delay: 0.15 + i * 0.13,
            });
        });
        gsap.to(descRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.7,
        });
        gsap.to(btnsRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.88,
        });
        gsap.to(scrollRef.current, { opacity: 1, duration: 1, delay: 1.2 });
        const heroImg = imgRef.current?.querySelector('img');
        if (heroImg) {
            gsap.to(heroImg, {
                yPercent: 16,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }
        gsap.to(contentRef.current, {
            yPercent: 10,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: '60% top',
                scrub: true,
            },
        });
    }, [animate]);

    return (
        <section
            id="hero"
            className="h-screen relative overflow-hidden flex items-end"
        >
            <div ref={imgRef} className="absolute inset-0">
                <Image
                    src="/hero.png"
                    alt="Sadeepa"
                    fill
                    priority
                    className="object-cover object-[60%_18%] scale-[1.08] brightness-[0.72] contrast-[1.12]"
                    style={{ transform: 'scale(1.08)' }}
                />
            </div>
            <div
                className="absolute inset-0 z-[1]"
                style={{
                    background:
                        'linear-gradient(105deg,rgba(10,10,8,.95) 0%,rgba(10,10,8,.6) 15%,rgba(10,10,8,.1) 100%), linear-gradient(to bottom,transparent 90%,rgba(10,10,8,.98) 100%)',
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-[600px] h-[400px] z-[1] pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse at bottom left,rgba(255,94,26,.07) 0%,transparent 70%)',
                }}
            />

            {/* Content */}
            <div
                ref={contentRef}
                className="relative z-[2] px-6 md:px-14 pb-12 md:pb-16 w-full"
            >
                <div className="flex items-center gap-3 mb-5 md:mb-7">
                    <span className="w-8 md:w-10 h-px bg-or" />
                    <span className="text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-or font-semibold">
                        Portfolio
                    </span>
                </div>

                <h1 className="text-[clamp(44px,7.5vw,138px)] font-extrabold leading-[0.88] tracking-[-0.04em] mb-7 md:mb-10">
                    <div className="hero-line overflow-hidden">
                        <div>
                            <ScrambleText
                                text="Investor"
                                delay={200}
                                duration={900}
                            />
                        </div>
                    </div>
                    <div className="hero-line overflow-hidden text-or">
                        <div>
                            <ScrambleText
                                text="Designer"
                                delay={400}
                                duration={900}
                            />
                        </div>
                    </div>
                    <div
                        className="hero-line overflow-hidden"
                        style={{
                            color: 'rgba(245,240,232,0.18)',
                            fontStyle: 'italic',
                            fontWeight: 400,
                        }}
                    >
                        <div>
                            <ScrambleText
                                text="& Developer"
                                delay={600}
                                duration={900}
                            />
                        </div>
                    </div>
                </h1>

                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-14">
                    <p
                        ref={descRef}
                        className="text-[13px] md:text-[14px] leading-[1.85] text-fg/50 max-w-[380px] opacity-0 translate-y-4"
                    >
                        Crafting digital experiences that sit between art and
                        engineering. Turning bold ideas into interfaces people
                        actually love.
                    </p>
                    <div
                        ref={btnsRef}
                        className="flex gap-3 flex-shrink-0 opacity-0 translate-y-4"
                    >
                        <MagneticBtn href="#projects" solid>
                            View Work →
                        </MagneticBtn>
                        <MagneticBtn href="#contact">
                            Let&apos;s Talk
                        </MagneticBtn>
                    </div>
                </div>
            </div>

            {/* Scroll indicator — hidden on small mobile */}
            <div
                ref={scrollRef}
                className="hidden sm:flex absolute right-6 md:right-14 bottom-12 md:bottom-16 z-[2] flex-col items-center gap-2.5 opacity-0"
            >
                <div className="w-px h-[52px] bg-or/20 relative overflow-hidden">
                    <div className="scroll-bar-inner absolute top-[-100%] left-0 w-full h-full bg-or" />
                </div>
                <span className="font-mono text-[9px] tracking-[0.25em] text-fg/30 [writing-mode:vertical-rl]">
                    Scroll
                </span>
            </div>
        </section>
    );
}
