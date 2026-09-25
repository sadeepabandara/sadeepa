'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
    id: string;
    title: string;
    tags: string[] | string;
    year: string;
    image?: string | null;
    category?: string | null;
    overview?: string | null;
    url?: string | null;
}

const fallback: Project[] = [
    { id: '1', title: 'Sadeepa Portfolio', tags: ['Next.js', 'GSAP', 'Framer Motion', 'Supabase'], year: '2026', category: 'Brand Identity / Web Development', overview: 'A fully custom personal portfolio with scroll-driven animations, mask cursor effect, Three.js hero, and a Supabase CMS.' },
    { id: '2', title: 'SpendWix Budget Tracker', tags: ['Next.js', 'Supabase', 'Stripe', 'Recharts'], year: '2025', category: 'FinTech / SaaS', overview: 'A personal finance dashboard with budget tracking, Stripe subscriptions, and visual spending reports.' },
    { id: '3', title: 'Frames Streaming Platform', tags: ['Next.js', 'MongoDB', 'Clerk', 'TMDB API'], year: '2026', category: 'Entertainment / Streaming', overview: 'A Netflix-inspired streaming discovery platform with real-time search and personalised watchlists.' },
    { id: '4', title: 'Melbourne Open Playground', tags: ['Next.js', 'PostgreSQL', 'JWT'], year: '2026', category: 'Community / Social', overview: 'A platform for Melbourne locals to discover and share open playgrounds and parks.' },
    { id: '5', title: 'Zippy Delivery Service', tags: ['React', 'Node.js', 'Tailwind CSS'], year: '2023', category: 'Logistics / E-Commerce', overview: 'A delivery management platform with driver dispatch, real-time order tracking, and customer storefront.' },
];

function parseTags(tags: string[] | string): string[] {
    if (Array.isArray(tags)) return tags;
    try { return JSON.parse(tags); } catch { return []; }
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        gsap.fromTo(card,
            { opacity: 0, y: 48 },
            {
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                delay: (index % 2) * 0.08,
                scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
            }
        );
    }, [index]);

    const tags = parseTags(project.tags ?? []);

    return (
        <div ref={cardRef} style={{ opacity: 0 }}>
            <Link href={`/projects/${project.id}`} className="group block no-underline">
                {/* Image card */}
                <div
                    className="relative overflow-hidden mb-4"
                    style={{
                        aspectRatio: '16/9',
                        background: 'var(--bg3)',
                        border: '1px solid rgba(235,89,57,0.08)',
                    }}
                >
                    {project.image ? (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, rgba(235,89,57,0.09) 0%, rgba(20,19,16,0.4) 100%)' }}
                        >
                            <span
                                className="font-syne font-extrabold tracking-[-0.04em] text-center px-6 leading-[0.88]"
                                style={{ fontSize: 'clamp(18px, 2.5vw, 34px)', color: 'rgba(245,240,232,0.1)' }}
                            >
                                {project.title}
                            </span>
                        </div>
                    )}

                    {/* Year badge */}
                    <span
                        className="absolute top-3 right-3 font-syne text-[10px] tracking-[0.12em] px-2 py-1"
                        style={{ background: 'rgba(13,13,13,0.75)', color: 'rgba(245,240,232,0.5)', backdropFilter: 'blur(6px)' }}
                    >
                        {project.year}
                    </span>

                    {/* Hover overlay */}
                    <div
                        className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 60%)' }}
                    >
                        <span
                            className="font-syne text-[10px] tracking-[0.2em] uppercase flex items-center gap-2"
                            style={{ color: 'var(--or)' }}
                        >
                            View Case Study →
                        </span>
                    </div>
                </div>

                {/* Card info */}
                {project.category && (
                    <p className="font-syne text-[9px] tracking-[0.24em] uppercase mb-1.5 transition-colors duration-200"
                        style={{ color: 'var(--or)', opacity: 0.7 }}>
                        {project.category}
                    </p>
                )}

                <h3
                    className="font-syne font-bold mb-2 leading-tight tracking-[-0.02em] transition-colors duration-200 group-hover:text-or"
                    style={{ fontSize: 'clamp(15px, 1.4vw, 20px)', color: 'var(--fg)' }}
                >
                    {project.title}
                </h3>

                {project.overview && (
                    <p className="text-[12px] md:text-[13px] leading-[1.75] mb-3 line-clamp-2"
                        style={{ color: 'var(--fg2)' }}>
                        {project.overview}
                    </p>
                )}

                <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.slice(0, 4).map((t) => (
                        <span key={t}
                            className="font-syne text-[9px] tracking-[0.1em] uppercase px-2 py-1 border"
                            style={{ borderColor: 'rgba(235,89,57,0.15)', color: 'var(--fg3)' }}>
                            {t}
                        </span>
                    ))}
                </div>

                <span
                    className="font-syne text-[10px] tracking-[0.18em] uppercase flex items-center gap-2 transition-colors duration-200 group-hover:gap-3"
                    style={{ color: 'var(--fg3)' }}
                >
                    View Case Study
                    <span className="transition-transform duration-200 group-hover:translate-x-1" style={{ color: 'var(--or)' }}>→</span>
                </span>
            </Link>
        </div>
    );
}

export default function AllProjectsClient({ projects }: { projects: Project[] }) {
    const headerRef = useRef<HTMLDivElement>(null);
    const list = projects.length > 0 ? projects : fallback;

    useEffect(() => {
        const els = headerRef.current?.querySelectorAll('.h-anim');
        if (!els) return;
        gsap.fromTo(els,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
        );
    }, []);

    return (
        <main style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh' }}>

            {/* Nav */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-14 py-5"
                style={{ background: 'rgba(13,13,13,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(235,89,57,0.08)' }}
            >
                <Link href="/"
                    className="font-syne text-[10px] tracking-[0.28em] uppercase transition-colors duration-200"
                    style={{ color: 'var(--fg2)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--or)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg2)')}>
                    ← Home
                </Link>
                <span className="font-syne text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--fg3)' }}>
                    Case Studies
                </span>
                <span className="font-syne text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--fg3)' }}>
                    {list.length} Projects
                </span>
            </nav>

            {/* Header */}
            <div
                ref={headerRef}
                className="pt-36 pb-14 px-6 md:px-14 text-center"
                style={{ borderBottom: '1px solid rgba(235,89,57,0.08)' }}
            >
                <p className="h-anim font-syne text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--or)', opacity: 0 }}>
                    Case Studies
                </p>
                <h1
                    className="h-anim font-syne font-extrabold tracking-[-0.04em] leading-[0.88] mb-6"
                    style={{ fontSize: 'clamp(42px, 8vw, 110px)', color: 'var(--fg)', opacity: 0 }}
                >
                    ALL PROJECTS
                </h1>
                <p className="h-anim font-syne text-[13px] md:text-[15px] leading-relaxed max-w-md mx-auto" style={{ color: 'var(--fg2)', opacity: 0 }}>
                    A curated collection of my work in development,<br className="hidden md:block" /> design, and product.
                </p>
            </div>

            {/* Grid */}
            <div className="px-6 md:px-14 py-14 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14 max-w-6xl mx-auto">
                    {list.map((p, i) => (
                        <ProjectCard key={p.id} project={p} index={i} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div
                className="px-6 md:px-14 py-10 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(235,89,57,0.08)' }}
            >
                <Link href="/"
                    className="font-syne text-[10px] tracking-[0.24em] uppercase transition-colors duration-200"
                    style={{ color: 'var(--fg3)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--or)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg3)')}>
                    ← Back to Home
                </Link>
                <span className="font-syne text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--fg3)' }}>
                    sadeepa.me
                </span>
            </div>
        </main>
    );
}
