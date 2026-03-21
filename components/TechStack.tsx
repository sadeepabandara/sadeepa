'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Using devicons CDN for perfect, official tech icons
const fallbackTop = [
    {
        name: 'Python',
        underline: '#FFD43B',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    },
    {
        name: 'TensorFlow',
        underline: '#FF6F00',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
    },
    {
        name: 'React',
        underline: '#61DAFB',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    },
    {
        name: 'Node.js',
        underline: '#83CD29',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
    },
    {
        name: 'Next.js',
        underline: '#ffffff',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    },
    {
        name: 'PostgreSQL',
        underline: '#336791',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    },
];

const fallbackBottom = [
    {
        name: 'Git',
        underline: '#F05032',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    },
    {
        name: 'Tailwind',
        underline: '#06B6D4',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    },
    {
        name: 'AWS',
        underline: '#FF9900',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    },
    {
        name: 'Docker',
        underline: '#2496ED',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    },
    {
        name: 'Redis',
        underline: '#DC382D',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
    },
    {
        name: 'TypeScript',
        underline: '#3178C6',
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    },
];

interface Tech {
    name: string;
    underline: string;
    icon: string;
}

function TechCard({ tech }: { tech: Tech }) {
    return (
        <div
            className="group flex flex-col items-center justify-center gap-3 p-4 md:p-6"
            style={{
                background: 'rgba(20,19,16,0.8)',
                border: '1px solid rgba(255,94,26,0.1)',
                borderRadius: '14px',
                flex: '1 1 0',
                minWidth: 0,
                aspectRatio: '1',
                backdropFilter: 'blur(8px)',
                cursor: 'default',
                transition: 'border-color 0.3s, transform 0.3s',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                    tech.underline + '80';
                (e.currentTarget as HTMLElement).style.transform =
                    'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                    'rgba(255,94,26,0.1)';
                (e.currentTarget as HTMLElement).style.transform =
                    'translateY(0)';
            }}
        >
            <img
                src={tech.icon}
                alt={tech.name}
                width={48}
                height={48}
                style={{
                    width: 48,
                    height: 48,
                    objectFit: 'contain',
                    flexShrink: 0,
                }}
                loading="lazy"
            />
            <div className="flex flex-col items-center gap-1.5 w-full">
                <span
                    className="font-bold text-center text-[11px] md:text-[13px] tracking-[-0.01em]"
                    style={{ color: 'rgba(245,240,232,0.85)' }}
                >
                    {tech.name}
                </span>
                <div
                    className="w-5 h-[2px] rounded-full"
                    style={{ background: tech.underline, opacity: 0.8 }}
                />
            </div>
        </div>
    );
}

interface TechItem {
    name: string;
    icon_url: string;
    underline: string;
    row: string;
    sort_order: number;
}

export default function TechStack({ data }: { data?: TechItem[] }) {
    const topRow = data
        ? data
              .filter((t) => t.row === 'top')
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((t) => ({
                  name: t.name,
                  underline: t.underline,
                  icon: t.icon_url,
              }))
        : fallbackTop;
    const bottomRow = data
        ? data
              .filter((t) => t.row === 'bottom')
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((t) => ({
                  name: t.name,
                  underline: t.underline,
                  icon: t.icon_url,
              }))
        : fallbackBottom;
    const sectionRef = useRef<HTMLElement>(null);
    const topRowRef = useRef<HTMLDivElement>(null);
    const botRowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const top = topRowRef.current;
        const bot = botRowRef.current;
        if (!section || !top || !bot) return;

        // Start fully off-screen
        gsap.set(top, { xPercent: -120, opacity: 0 });
        gsap.set(bot, { xPercent: 120, opacity: 0 });

        const triggers: ScrollTrigger[] = [];

        // Top row — starts just before section enters, finishes when section top = viewport top
        triggers.push(
            ScrollTrigger.create({
                trigger: section,
                start: 'top 85%', // just before section is fully visible
                end: 'top 0%', // done exactly when section top hits top of screen
                scrub: 2.5,
                onUpdate: (self) => {
                    const p = self.progress;
                    gsap.set(top, {
                        xPercent: -120 + p * 120,
                        opacity: Math.min(p * 2.5, 1),
                    });
                },
            }),
        );

        // Bottom row — same range
        triggers.push(
            ScrollTrigger.create({
                trigger: section,
                start: 'top 85%',
                end: 'top 0%',
                scrub: 2.5,
                onUpdate: (self) => {
                    const p = self.progress;
                    gsap.set(bot, {
                        xPercent: 120 - p * 120,
                        opacity: Math.min(p * 2.5, 1),
                    });
                },
            }),
        );

        return () => triggers.forEach((t) => t.kill());
    }, []);

    return (
        <section
            ref={sectionRef}
            id="techstack"
            className="px-6 md:px-14 py-20 md:py-28 border-t"
            style={{ borderColor: 'var(--line)', background: 'var(--bg2)' }}
        >
            {/* Header */}
            <div className="mb-12">
                <div className="text-[10px] tracking-[0.38em] uppercase text-or mb-4 flex items-center gap-3">
                    <span className="w-[18px] h-px bg-or" />
                    Tech Stack
                </div>
                <h2 className="text-[clamp(28px,4vw,58px)] font-extrabold leading-[.95] tracking-[-0.03em]">
                    Tools I<br />
                    <em className="not-italic font-normal text-fg/40">
                        work with.
                    </em>
                </h2>
            </div>

            {/* Clip wrapper — padding ensures hover lift isn't clipped */}
            <div
                style={{
                    overflow: 'hidden',
                    padding: '8px 2px 4px',
                    margin: '-8px -2px -4px',
                }}
            >
                {/* Top row — slides from LEFT */}
                <div
                    ref={topRowRef}
                    className="flex gap-3 md:gap-4 mb-3 md:mb-4 w-full"
                >
                    {topRow.map((tech) => (
                        <TechCard key={tech.name} tech={tech} />
                    ))}
                </div>

                {/* Bottom row — slides from RIGHT */}
                <div ref={botRowRef} className="flex gap-3 md:gap-4 w-full">
                    {bottomRow.map((tech) => (
                        <TechCard key={tech.name} tech={tech} />
                    ))}
                </div>
            </div>
        </section>
    );
}
