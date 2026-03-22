'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AboutData {
    bio_line1: string;
    bio_line2?: string;
    stat_years: string;
    stat_projects: string;
    stat_clients: string;
    github_url?: string;
    linkedin_url?: string;
    email?: string;
    resume_url?: string;
}

const fallback: AboutData = {
    bio_line1:
        "I'm Sadeepa Bandara, a 24-year-old Software Developer & Designer from Sri Lanka, currently based in Australia. I hold a BSc (Hons) in Computing from Coventry University, UK.",
    bio_line2:
        "As an Investor, Entrepreneur, Developer and Designer, I'm passionate about innovation and growth. I'm pursuing an MSc in Information Technology Management at Deakin University while exploring forex trading and video editing.",
    stat_years: '3+',
    stat_projects: '20+',
    stat_clients: '10+',
    github_url: 'https://github.com/sadeepabandara',
    linkedin_url: 'https://linkedin.com/in/sadeepa-bandara',
    email: 'sadeepadexter@gmail.com',
    resume_url: '/resume.pdf',
};

export default function About({ data }: { data?: AboutData | null }) {
    const d = data ?? fallback;
    const sectionRef = useRef<HTMLElement>(null);

    const stats = [
        { num: d.stat_years, label: 'Years exp' },
        { num: d.stat_projects, label: 'Projects' },
        { num: d.stat_clients, label: 'Clients' },
    ];

    useEffect(() => {
        sectionRef.current?.querySelectorAll('.fu').forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 52 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.05,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                },
            );
        });
        gsap.to('#about-photo-img', {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: {
                trigger: '#about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="flex flex-col md:grid md:gap-20 items-start px-6 md:px-14 py-16 md:py-[110px] bg-bg2 border-t gap-10"
            style={{
                gridTemplateColumns: '1fr 1.3fr',
                borderColor: 'var(--line)',
            }}
        >
            {/* LEFT — photo */}
            <div className="w-full md:sticky md:top-[110px]">
                <div
                    className="overflow-hidden relative group w-full max-w-[420px] mx-auto md:max-w-none"
                    style={{ aspectRatio: '3/4' }}
                >
                    <Image
                        id="about-photo-img"
                        src="/about.png"
                        alt="Sadeepa"
                        fill
                        className="object-cover object-[center_20%] transition-transform duration-[1200ms] ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-[1.04]"
                        style={{ filter: 'grayscale(10%) contrast(1.05)' }}
                    />
                </div>
                <p className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-fg/25 text-center md:text-left">
                    © Sadeepa — The Creative
                </p>
            </div>

            {/* RIGHT — content */}
            <div>
                <div className="fu text-[10px] tracking-[0.38em] uppercase text-or mb-8 flex items-center gap-3">
                    <span className="w-[18px] h-px bg-or flex-shrink-0" />
                    About Me
                </div>
                <h2 className="fu text-[clamp(32px,4.5vw,64px)] font-extrabold leading-[.95] tracking-[-0.03em] mb-8">
                    I build things
                    <br />
                    <em className="not-italic font-normal text-fg/50">
                        worth clicking.
                    </em>
                </h2>

                <p className="fu text-[15px] md:text-[15.5px] leading-[1.88] text-fg/50 mb-6 max-w-[540px]">
                    {d.bio_line1}
                </p>
                {d.bio_line2 && (
                    <p className="fu text-[15px] md:text-[15.5px] leading-[1.88] text-fg/50 mb-6 max-w-[540px]">
                        {d.bio_line2}
                    </p>
                )}

                {/* Links */}
                <div className="fu flex flex-wrap gap-3 mb-8">
                    {d.github_url && (
                        <a
                            href={d.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg/40 border border-fg/10 px-3 py-2 hover:border-or/50 hover:text-or transition-colors duration-300 no-underline flex items-center gap-2"
                        >
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub →
                        </a>
                    )}
                    {d.linkedin_url && (
                        <a
                            href={d.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg/40 border border-fg/10 px-3 py-2 hover:border-or/50 hover:text-or transition-colors duration-300 no-underline flex items-center gap-2"
                        >
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn →
                        </a>
                    )}
                    {d.resume_url && (
                        <a
                            href={d.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg/40 border border-fg/10 px-3 py-2 hover:border-or/50 hover:text-or transition-colors duration-300 no-underline flex items-center gap-2"
                        >
                            <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                            Resume →
                        </a>
                    )}
                </div>

                <hr className="fu my-11 border-none h-px bg-or/10" />
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="fu border-t pt-4 md:pt-5"
                            style={{ borderColor: 'var(--line)' }}
                        >
                            <div className="text-[32px] md:text-[42px] font-extrabold tracking-[-0.03em] leading-none mb-1.5 text-or">
                                {s.num}
                            </div>
                            <div className="text-[9px] md:text-[10px] tracking-[0.15em] uppercase text-fg/25">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
