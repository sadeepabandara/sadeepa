'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface Project {
    id: string;
    number: string;
    title: string;
    tags: string[];
    year: string;
    url: string | null;
    image?: string | null;
    // Detail page fields (optional — show what's available)
    category?: string;
    overview?: string;
    challenge?: string;
    role?: string;
    client?: string;
    images?: string[];
}

const fallbackProjects: Project[] = [
    {
        id: '1',
        number: '001',
        title: 'Sadeepa Portfolio',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Supabase'],
        year: '2026',
        url: 'https://sadeepa.me',
        image: null,
        category: 'Brand Identity / Web Development',
        overview: 'A fully custom personal portfolio built from the ground up to reflect my approach to development — obsessive attention to detail, clean architecture, and experiences that feel alive. Features scroll-driven animations, a custom mask cursor effect, Three.js particle hero, interactive terminal, and a Supabase-powered CMS.',
        challenge: 'Balancing visual richness with performance. Every animation needed to feel premium without sacrificing load time or accessibility.',
        role: 'Designer & Developer',
        client: 'Personal',
    },
    {
        id: '2',
        number: '002',
        title: 'SpendWix Budget Tracker',
        tags: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Framer Motion', 'Recharts'],
        year: '2025',
        url: null,
        image: null,
        category: 'FinTech / SaaS',
        overview: 'A personal finance dashboard that lets users track spending, set budgets, and visualise their money habits over time. Includes Stripe-powered subscriptions for a Pro tier with advanced reporting and CSV exports.',
        challenge: 'Designing a financial product that felt approachable rather than intimidating — turning raw numbers into clear visual stories.',
        role: 'Full-Stack Developer',
        client: 'Open Source',
    },
    {
        id: '3',
        number: '003',
        title: 'Frames Streaming Platform',
        tags: ['Next.js', 'TypeScript', 'MongoDB', 'Clerk', 'Zustand', 'TMDB API'],
        year: '2026',
        url: 'https://watchframes.vercel.app',
        image: null,
        category: 'Entertainment / Streaming',
        overview: 'A Netflix-inspired streaming discovery platform powered by the TMDB API. Features real-time search, personalised watchlists, and a clean cinema-dark UI. Auth is handled by Clerk and state by Zustand.',
        challenge: 'Building a fast, fluid browsing experience across thousands of titles without sacrificing perceived performance.',
        role: 'Full-Stack Developer',
        client: 'Personal',
    },
    {
        id: '4',
        number: '004',
        title: 'Melbourne Open Playground',
        tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'JWT', 'Bcrypt'],
        year: '2026',
        url: null,
        image: null,
        category: 'Community / Social',
        overview: 'A platform for Melbourne locals to discover and share open playgrounds, parks, and recreational spaces. Features user-generated listings, reviews, and map integration.',
        challenge: 'Handling geospatial data efficiently and building a trustworthy moderation system for community-submitted content.',
        role: 'Full-Stack Developer',
        client: 'Open Source',
    },
    {
        id: '5',
        number: '005',
        title: 'Zippy Delivery Service',
        tags: ['React', 'Node.js', 'Tailwind CSS', 'Jira', 'Git'],
        year: '2023',
        url: null,
        image: null,
        category: 'Logistics / E-Commerce',
        overview: 'A delivery management platform built as a university team project. Includes driver dispatch, real-time order tracking, and a customer-facing storefront. Managed delivery through Agile sprints using Jira.',
        challenge: 'Coordinating a multi-person team on a tight deadline while maintaining code quality and consistent design across the product.',
        role: 'Lead Developer',
        client: 'University Project',
    },
];

interface ProjectsProps {
    projects?: Project[];
}

// ── Hover Popup ────────────────────────────────────────────────────────────
function ProjectPopup({
    project, prevProject, visible, mouseX, mouseY, direction,
}: {
    project: Project | null;
    prevProject: Project | null;
    visible: boolean;
    mouseX: number;
    mouseY: number;
    direction: 'up' | 'down';
}) {
    const popupRef = useRef<HTMLDivElement>(null);
    const currentRef = useRef<HTMLDivElement>(null);
    const prevRef = useRef<HTMLDivElement>(null);
    const quickX = useRef<((v: number) => void) | null>(null);
    const quickY = useRef<((v: number) => void) | null>(null);

    useEffect(() => {
        const popup = popupRef.current;
        if (!popup) return;
        quickX.current = gsap.quickTo(popup, 'x', { duration: 0.35, ease: 'power3.out' });
        quickY.current = gsap.quickTo(popup, 'y', { duration: 0.35, ease: 'power3.out' });
    }, []);

    useEffect(() => {
        if (quickX.current) quickX.current(mouseX + 28);
        if (quickY.current) quickY.current(mouseY - 140);
    }, [mouseX, mouseY]);

    useEffect(() => {
        const popup = popupRef.current;
        if (!popup) return;
        gsap.to(popup, visible
            ? { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
            : { opacity: 0, scale: 0.94, duration: 0.22, ease: 'power2.in' });
    }, [visible]);

    useEffect(() => {
        if (!project || !prevProject || project.id === prevProject.id) return;
        const cur = currentRef.current;
        const prev = prevRef.current;
        if (!cur || !prev) return;
        const yOut = direction === 'down' ? -40 : 40;
        const yIn = direction === 'down' ? 40 : -40;
        gsap.fromTo(prev, { y: 0, opacity: 1 }, { y: yOut, opacity: 0, duration: 0.32, ease: 'power2.in' });
        gsap.fromTo(cur, { y: yIn, opacity: 0 }, { y: 0, opacity: 1, duration: 0.38, ease: 'power2.out', delay: 0.06 });
    }, [project, prevProject, direction]);

    const imgPlaceholder = (title: string) => (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, rgba(255,94,26,0.08) 0%, rgba(20,19,16,0.6) 100%)' }}>
            <span className="font-syne text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,94,26,0.4)' }}>Preview</span>
            <span className="text-[13px] font-extrabold tracking-[-0.02em] text-center px-4 leading-tight" style={{ color: 'rgba(245,240,232,0.6)' }}>{title}</span>
        </div>
    );

    return (
        <div ref={popupRef} className="fixed top-0 left-0 pointer-events-none z-[8000]"
            style={{ opacity: 0, transform: 'scale(0.94)', transformOrigin: 'top left', willChange: 'transform, opacity' }}>
            <div className="relative overflow-hidden"
                style={{ width: 420, height: 280, background: 'var(--bg3)', border: '1px solid rgba(255,94,26,0.18)', boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,94,26,0.06)' }}>
                {prevProject && (
                    <div ref={prevRef} className="absolute inset-0">
                        {prevProject.image ? <img src={prevProject.image} alt={prevProject.title} className="w-full h-full object-cover" /> : imgPlaceholder(prevProject.title)}
                    </div>
                )}
                {project && (
                    <div ref={currentRef} className="absolute inset-0">
                        {project.image ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" /> : imgPlaceholder(project.title)}
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3"
                    style={{ background: 'linear-gradient(to top, rgba(10,10,8,0.95) 0%, rgba(10,10,8,0.0) 100%)', paddingTop: 28 }}>
                    <span className="font-syne text-[9px] tracking-[0.15em] uppercase" style={{ color: 'rgba(245,240,232,0.4)' }}>{project?.year}</span>
                    <span className="font-syne text-[9px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,94,26,0.6)' }}>Open project →</span>
                </div>
                <div className="absolute top-0 right-0 w-6 h-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-0 h-0" style={{ borderLeft: '24px solid transparent', borderTop: '24px solid rgba(255,94,26,0.5)' }} />
                </div>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Projects({ projects = fallbackProjects }: ProjectsProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
    const [prevProject, setPrevProject] = useState<Project | null>(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });
    const [direction, setDirection] = useState<'up' | 'down'>('down');
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const projectIndexRef = useRef<number>(-1);

    useEffect(() => {
        sectionRef.current?.querySelectorAll('.fu').forEach((el) => {
            gsap.fromTo(el, { opacity: 0, y: 52 }, {
                opacity: 1, y: 0, duration: 1.05, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            });
        });

        const section = sectionRef.current;
        if (!section) return;
        const ctx = gsap.context(() => {
            section.querySelectorAll<HTMLElement>('.proj-title-fill').forEach((fill) => {
                const row = fill.closest<HTMLElement>('.proj-item');
                if (!row) return;
                gsap.fromTo(fill, { clipPath: 'inset(0 100% 0 0)' }, {
                    clipPath: 'inset(0 0% 0 0)', ease: 'none',
                    scrollTrigger: { trigger: row, start: 'top 100%', end: 'top 5%', scrub: 1.1 },
                });
            });
        }, section);
        return () => ctx.revert();
    }, []);

    const handleMouseEnter = useCallback((p: Project, index: number) => {
        const dir = index > projectIndexRef.current ? 'down' : 'up';
        setDirection(dir);
        setPrevProject(hoveredProject);
        setHoveredProject(p);
        setPopupVisible(true);
        projectIndexRef.current = index;
    }, [hoveredProject]);

    const handleMouseLeave = useCallback(() => setPopupVisible(false), []);

    useEffect(() => {
        const onPointerMove = (e: PointerEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            const el = document.elementFromPoint(e.clientX, e.clientY);
            if (!el?.closest('.proj-item')) setPopupVisible(false);
        };
        window.addEventListener('pointermove', onPointerMove);
        return () => window.removeEventListener('pointermove', onPointerMove);
    }, []);

    return (
        <>
            <ProjectPopup
                project={hoveredProject}
                prevProject={prevProject}
                visible={popupVisible && !activeProject}
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                direction={direction}
            />

            <section
                id="projects"
                ref={sectionRef}
                className="px-6 md:px-14 py-16 md:py-[110px] bg-bg2 border-t"
                style={{ borderColor: 'var(--line)' }}
                onMouseLeave={handleMouseLeave}
            >
                <div className="fu text-[10px] tracking-[0.38em] uppercase text-or mb-8 flex items-center gap-3">
                    <span className="w-[18px] h-px bg-or" />
                    Selected Work
                </div>
                <h2 className="fu text-[clamp(32px,4.5vw,64px)] font-extrabold leading-[.95] tracking-[-0.03em] mb-10 md:mb-14">
                    Things I&apos;ve<br />
                    <em className="not-italic font-normal text-fg/50">shipped.</em>
                </h2>
                <div>
                    {projects.map((p, i) => (
                        <Link
                            key={p.id}
                            href={`/projects/${p.id}`}
                            className="proj-item fu grid items-center gap-4 md:gap-10 py-5 md:py-7 border-b no-underline transition-[padding,background] duration-[400ms] ease-[cubic-bezier(.23,1,.32,1)] hover:md:pl-[18px] hover:bg-or/[0.02] group cursor-none"
                            style={{ gridTemplateColumns: '40px 1fr auto', borderColor: 'var(--line)' }}
                            onMouseEnter={() => handleMouseEnter(p, i)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <span className="font-syne text-[10px] md:text-[11px] text-or/35 tracking-[0.12em]">
                                {p.number}
                            </span>
                            <div>
                                <h3 className="relative text-[clamp(18px,3vw,38px)] font-extrabold tracking-[-0.025em] leading-none mb-2 transition-colors duration-300 group-hover:text-or">
                                    <span className="sr-only">{p.title}</span>
                                    <span aria-hidden="true" className="block" style={{ color: 'rgba(245,240,232,0.2)' }}>{p.title}</span>
                                    <span aria-hidden="true" className="proj-title-fill absolute inset-0 block"
                                        style={{ color: 'var(--fg)', clipPath: 'inset(0 100% 0 0)', willChange: 'clip-path' }}>
                                        {p.title}
                                    </span>
                                </h3>
                                <div className="flex gap-2 flex-wrap">
                                    {p.tags.map((t) => (
                                        <span key={t} className="text-[9px] md:text-[10px] tracking-[0.1em] uppercase border border-fg/[0.07] px-2 py-[3px]" style={{ color: 'var(--fg-muted)' }}>
                                            {t}
                                        </span>
                                    ))}
                                    <span className="text-[9px] md:text-[10px] tracking-[0.1em] uppercase border border-fg/[0.07] px-2 py-[3px]" style={{ color: 'var(--fg-muted)' }}>
                                        {p.year}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[18px] md:text-[20px] text-or/35 transition-[transform,color] duration-[400ms] ease-[cubic-bezier(.23,1,.32,1)] group-hover:translate-x-1.5 group-hover:-rotate-45 group-hover:text-or">
                                →
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
