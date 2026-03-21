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
                            className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg/40 border border-fg/10 px-3 py-2 hover:border-or/50 hover:text-or transition-colors duration-300 no-underline"
                        >
                            GitHub →
                        </a>
                    )}
                    {d.linkedin_url && (
                        <a
                            href={d.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg/40 border border-fg/10 px-3 py-2 hover:border-or/50 hover:text-or transition-colors duration-300 no-underline"
                        >
                            LinkedIn →
                        </a>
                    )}
                    {d.resume_url && (
                        <a
                            href={d.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] tracking-[0.14em] uppercase text-fg/40 border border-fg/10 px-3 py-2 hover:border-or/50 hover:text-or transition-colors duration-300 no-underline"
                        >
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
