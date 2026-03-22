'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
    number: string;
    icon: string;
    title: string;
    description: string;
    tags: string[];
}
interface ServicesProps {
    data?: ServiceItem[];
}

const fallbackServices: ServiceItem[] = [
    {
        number: '01',
        icon: '◈',
        title: 'Web Design & Development',
        description:
            'Stunning, user-friendly websites using the latest design trends and development techniques, ensuring a seamless and engaging user experience.',
        tags: ['React', 'Next.js', 'Tailwind'],
    },
    {
        number: '02',
        icon: '◉',
        title: 'Search Engine Optimization',
        description:
            'Boost your online visibility with expert SEO strategies, improving search rankings, driving organic traffic, and increasing conversions.',
        tags: ['SEO', 'Analytics', 'Content'],
    },
    {
        number: '03',
        icon: '◇',
        title: 'Graphic Design',
        description:
            'Compelling visuals with innovative graphic design, enhancing brand identity and engaging audiences through aesthetically pleasing designs.',
        tags: ['Figma', 'Illustrator', 'Branding'],
    },
    {
        number: '04',
        icon: '⬡',
        title: 'Software Development',
        description:
            'Custom software solutions, focusing on functionality and innovation to meet your unique business needs and drive digital transformation.',
        tags: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
        number: '05',
        icon: '⬢',
        title: 'Video Editing',
        description:
            'Professional video editing, transforming raw footage into polished, captivating content tailored to your vision and audience.',
        tags: ['Premiere Pro', 'After Effects'],
    },
    {
        number: '06',
        icon: '◎',
        title: 'Game Development',
        description:
            'Immersive games blending creativity and technology to deliver captivating experiences across various platforms, engaging players and pushing boundaries.',
        tags: ['Unity', 'C#', 'Game Design'],
    },
];

export default function Services({ data }: ServicesProps) {
    const services = (data && data.length ? data : fallbackServices).map(
        (s) => ({
            num: s.number,
            icon: s.icon,
            title: s.title,
            desc: s.description,
            tags: s.tags,
        }),
    );
    const wrapRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const sticky = stickyRef.current;
        const track = trackRef.current;
        const wrap = wrapRef.current;
        if (!sticky || !track || !wrap) return;

        // On mobile, disable horizontal scroll, just show grid
        if (window.innerWidth < 768) return;

        const CARD_W = 360,
            GAP = 18;
        const totalCardsWidth =
            CARD_W * services.length + GAP * (services.length - 1);
        const viewW = sticky.clientWidth - 56 * 2; // minus px-14 padding both sides
        const tot = Math.max(0, totalCardsWidth - viewW);
        wrap.style.height = `${window.innerHeight + tot + 120}px`;

        const st = ScrollTrigger.create({
            trigger: wrap,
            start: 'top top',
            end: `+=${tot + 120}`,
            pin: sticky,
            scrub: true,
            onUpdate: (self) => {
                gsap.set(track, { x: -self.progress * tot });
                if (progressRef.current)
                    progressRef.current.style.width = `${self.progress * 100}%`;
                if (counterRef.current) {
                    const idx = Math.min(
                        services.length - 1,
                        Math.floor(self.progress * services.length),
                    );
                    counterRef.current.textContent = `0${idx + 1}`;
                }
            },
        });

        sticky.querySelectorAll('.fu').forEach((el) => {
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

        const onResize = () => {
            const newViewW = sticky.clientWidth - 56 * 2;
            const newTot = Math.max(0, totalCardsWidth - newViewW);
            wrap.style.height = `${window.innerHeight + newTot + 120}px`;
            st.refresh();
        };
        window.addEventListener('resize', onResize);
        return () => {
            st.kill();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div id="services" ref={wrapRef} className="relative">
            {/* ── DESKTOP: horizontal scroll ── */}
            <div
                ref={stickyRef}
                className="hidden md:flex sticky top-0 h-screen overflow-hidden flex-col justify-center border-t"
                style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
            >
                <div className="px-14 mb-11 flex justify-between items-end flex-shrink-0">
                    <div>
                        <div className="fu text-[10px] tracking-[0.38em] uppercase text-or flex items-center gap-3 mb-3 mt-5">
                            <span className="w-[18px] h-px bg-or" />
                            What I Do
                        </div>
                        <h2 className="fu text-[clamp(32px,4.5vw,60px)] font-extrabold leading-[.94] tracking-[-0.03em]">
                            Services built
                            <br />
                            <em className="not-italic font-normal text-fg/50">
                                around you.
                            </em>
                        </h2>
                    </div>
                    <div className="flex flex-col items-end gap-2.5 pb-1">
                        <div className="font-mono text-[11px] tracking-[0.14em] text-fg/30 flex items-center gap-3">
                            <span ref={counterRef}>01</span>
                            <span className="text-fg/15">/</span>
                            <span>0{services.length}</span>
                            <div
                                className="w-[100px] h-px relative overflow-hidden"
                                style={{ background: 'var(--or-ln)' }}
                            >
                                <div
                                    ref={progressRef}
                                    className="absolute left-0 top-0 h-full bg-or w-0"
                                />
                            </div>
                        </div>
                        <span className="text-[10px] tracking-[0.18em] uppercase text-fg/20">
                            Drag to explore
                        </span>
                    </div>
                </div>
                <div className="overflow-visible pl-14 flex-shrink-0">
                    <div ref={trackRef} className="flex gap-[18px] w-max">
                        {services.map((s) => (
                            <div
                                key={s.num}
                                className="svc-card w-[360px] h-[440px] bg-bg3 border border-fg/[0.06] p-[40px_34px] flex-shrink-0 flex flex-col justify-between relative overflow-hidden transition-[background,border-color] duration-[400ms] hover:bg-bg4 hover:border-or/20"
                            >
                                <div>
                                    <div className="font-mono text-[10px] tracking-[0.2em] text-or/40 mb-6">
                                        {s.num}
                                    </div>
                                    <span className="text-[28px] mb-4 block text-or">
                                        {s.icon}
                                    </span>
                                    <h3 className="text-[21px] font-bold tracking-[-0.02em] mb-3 leading-[1.1]">
                                        {s.title}
                                    </h3>
                                    <p className="text-[13px] leading-[1.75] text-fg/50">
                                        {s.desc}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {s.tags.map((t) => (
                                        <span
                                            key={t}
                                            className="text-[10px] tracking-[0.08em] uppercase text-or/60 border border-or/15 px-2.5 py-1"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MOBILE: vertical grid ── */}
            <div
                className="md:hidden px-6 py-16 border-t"
                style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
            >
                <div className="text-[10px] tracking-[0.38em] uppercase text-or flex items-center gap-3 mb-4">
                    <span className="w-[18px] h-px bg-or" />
                    What I Do
                </div>
                <h2 className="text-[clamp(32px,8vw,48px)] font-extrabold leading-[.94] tracking-[-0.03em] mb-10">
                    Services built
                    <br />
                    <em className="not-italic font-normal text-fg/50">
                        around you.
                    </em>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((s) => (
                        <div
                            key={s.num}
                            className="bg-bg3 border border-fg/[0.06] p-7 flex flex-col justify-between relative overflow-hidden min-h-[260px]"
                        >
                            <div>
                                <div className="font-mono text-[10px] tracking-[0.2em] text-or/40 mb-4">
                                    {s.num}
                                </div>
                                <span className="text-[24px] mb-3 block text-or">
                                    {s.icon}
                                </span>
                                <h3 className="text-[18px] font-bold tracking-[-0.02em] mb-2 leading-[1.1]">
                                    {s.title}
                                </h3>
                                <p className="text-[13px] leading-[1.75] text-fg/50">
                                    {s.desc}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-5">
                                {s.tags.map((t) => (
                                    <span
                                        key={t}
                                        className="text-[10px] tracking-[0.08em] uppercase text-or/60 border border-or/15 px-2.5 py-1"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
