'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

interface Project {
    id: string;
    number?: string;
    title: string;
    tags: string[];
    year: string;
    url?: string | null;
    image?: string | null;
    images?: string[] | null;
    category?: string | null;
    overview?: string | null;
    challenge?: string | null;
    role?: string | null;
    client?: string | null;
}

export default function ProjectDetailPage({ project }: { project: Project }) {
    const heroRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(heroRef.current,
            { opacity: 0, scale: 1.03 },
            { opacity: 1, scale: 1, duration: 0.9 }
        ).fromTo(
            contentRef.current?.querySelectorAll('.anim') ?? [],
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
            '-=0.4'
        );
    }, []);

    const tags = Array.isArray(project.tags)
        ? project.tags
        : typeof project.tags === 'string'
            ? JSON.parse(project.tags)
            : [];

    return (
        <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>

            {/* ── Nav bar ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-14 py-5"
                style={{ background: 'rgba(13,13,13,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(235,89,57,0.08)' }}>
                <Link href="/"
                    className="font-syne text-[10px] tracking-[0.28em] uppercase flex items-center gap-2 transition-colors duration-200"
                    style={{ color: 'var(--fg2)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--or)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg2)')}>
                    ← Back
                </Link>
                <span className="font-syne text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--fg3)' }}>
                    sadeepa.me
                </span>
            </nav>

            {/* ── Full-bleed hero image ── */}
            <div ref={heroRef} className="w-full relative overflow-hidden"
                style={{ height: 'clamp(260px, 50vw, 600px)', marginTop: 0, background: 'var(--bg3)' }}>
                {project.image ? (
                    <img src={project.image} alt={project.title}
                        className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.8)' }} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(235,89,57,0.07) 0%, #0d0d0d 100%)' }}>
                        <span className="font-syne font-extrabold tracking-[-0.04em] text-center px-8 leading-[0.9]"
                            style={{ fontSize: 'clamp(36px, 7vw, 110px)', color: 'rgba(245,240,232,0.06)' }}>
                            {project.title}
                        </span>
                    </div>
                )}
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, var(--bg), transparent)' }} />
            </div>

            {/* ── Header block (overlaps hero bottom) ── */}
            <div ref={contentRef} className="px-6 md:px-14 pb-20" style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Category */}
                {project.category && (
                    <p className="anim font-syne text-[10px] md:text-[11px] tracking-[0.32em] uppercase mb-5 mt-10"
                        style={{ color: 'var(--or)' }}>
                        {project.category}
                    </p>
                )}

                {/* Title */}
                <h1 className="anim font-syne font-extrabold leading-[0.9] tracking-[-0.03em] mb-7"
                    style={{ fontSize: 'clamp(36px, 6.5vw, 96px)', color: 'var(--fg)' }}>
                    {project.title.toUpperCase()}
                </h1>

                {/* Tags */}
                <div className="anim flex flex-wrap gap-2 mb-14">
                    {tags.map((t: string) => (
                        <span key={t}
                            className="font-syne text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border"
                            style={{ borderColor: 'rgba(235,89,57,0.2)', color: 'var(--fg2)' }}>
                            {t}
                        </span>
                    ))}
                </div>

                {/* Divider */}
                <div className="anim w-full h-px mb-14" style={{ background: 'rgba(235,89,57,0.1)' }} />

                {/* Two-column body */}
                <div className="anim grid md:grid-cols-[1fr_260px] gap-12 md:gap-20">

                    {/* Left — overview + challenge */}
                    <div className="flex flex-col gap-12">
                        {project.overview && (
                            <div>
                                <h2 className="flex items-center gap-3 font-syne font-bold text-[11px] tracking-[0.28em] uppercase mb-5"
                                    style={{ color: 'var(--or)' }}>
                                    <span className="w-6 h-px inline-block" style={{ background: 'var(--or)' }} />
                                    Overview
                                </h2>
                                <p className="text-[14px] md:text-[15.5px] leading-[1.9]" style={{ color: 'var(--fg2)' }}>
                                    {project.overview}
                                </p>
                            </div>
                        )}
                        {project.challenge && (
                            <div>
                                <h2 className="flex items-center gap-3 font-syne font-bold text-[11px] tracking-[0.28em] uppercase mb-5"
                                    style={{ color: 'var(--or)' }}>
                                    <span className="w-6 h-px inline-block" style={{ background: 'var(--or)' }} />
                                    The Challenge
                                </h2>
                                <p className="text-[14px] md:text-[15.5px] leading-[1.9]" style={{ color: 'var(--fg2)' }}>
                                    {project.challenge}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right — project info sidebar */}
                    <div className="flex flex-col gap-px" style={{ border: '1px solid rgba(235,89,57,0.1)' }}>
                        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(235,89,57,0.08)', background: 'var(--bg2)' }}>
                            <p className="font-syne text-[9px] tracking-[0.24em] uppercase mb-1.5" style={{ color: 'var(--fg3)' }}>Year</p>
                            <p className="font-syne font-bold text-[16px]" style={{ color: 'var(--fg)' }}>{project.year}</p>
                        </div>
                        {project.role && (
                            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(235,89,57,0.08)', background: 'var(--bg2)' }}>
                                <p className="font-syne text-[9px] tracking-[0.24em] uppercase mb-1.5" style={{ color: 'var(--fg3)' }}>Role</p>
                                <p className="font-syne font-bold text-[16px]" style={{ color: 'var(--fg)' }}>{project.role}</p>
                            </div>
                        )}
                        {project.client && (
                            <div className="px-5 py-4" style={{ background: 'var(--bg2)' }}>
                                <p className="font-syne text-[9px] tracking-[0.24em] uppercase mb-1.5" style={{ color: 'var(--fg3)' }}>Client</p>
                                <p className="font-syne font-bold text-[16px]" style={{ color: 'var(--fg)' }}>{project.client}</p>
                            </div>
                        )}

                        {/* CTA buttons */}
                        <div className="flex flex-col gap-2 mt-4 px-0">
                            {project.url && (
                                <a href={project.url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 py-4 font-syne font-bold text-[11px] tracking-[0.2em] uppercase transition-opacity duration-200 hover:opacity-90"
                                    style={{ background: 'var(--fg)', color: 'var(--bg)' }}>
                                    EXPLORE MORE
                                </a>
                            )}
                            {project.url && (
                                <a href={project.url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 py-4 font-syne font-bold text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 hover:border-or"
                                    style={{ background: 'var(--bg3)', color: 'var(--fg)', border: '1px solid rgba(235,89,57,0.15)' }}>
                                    VIEW CODE
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Extra images grid */}
                {project.images && project.images.length > 0 && (
                    <div className="mt-16 grid gap-5 md:grid-cols-2">
                        {project.images.map((src: string, i: number) => (
                            <img key={i} src={src} alt={`${project.title} screenshot ${i + 1}`}
                                className="w-full object-cover"
                                style={{ border: '1px solid rgba(235,89,57,0.08)' }} />
                        ))}
                    </div>
                )}

                {/* Back link */}
                <div className="mt-20 pt-10" style={{ borderTop: '1px solid rgba(235,89,57,0.1)' }}>
                    <Link href="/#projects"
                        className="font-syne text-[11px] tracking-[0.24em] uppercase flex items-center gap-3 transition-colors duration-200 w-fit"
                        style={{ color: 'var(--fg3)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--or)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg3)')}>
                        ← Back to all projects
                    </Link>
                </div>
            </div>
        </main>
    );
}
