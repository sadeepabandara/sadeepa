'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EduItem {
    period: string;
    degree: string;
    institution: string;
    description: string;
    align: string;
}

const fallbackEducation: EduItem[] = [
    {
        period: '2021 - 2022',
        degree: 'Diploma in Information Technology',
        institution: 'ESOFT Metro Campus, Sri Lanka',
        description:
            'Foundations of programming, networking, database management and software development principles.',
        align: 'top',
    },
    {
        period: '2022 - 2023',
        degree: 'Higher Diploma in Information Technology',
        institution: 'ESOFT Metro Campus, Sri Lanka',
        description:
            'Advanced software engineering, web development, system analysis and design methodologies.',
        align: 'bottom',
    },
    {
        period: '2021 - 2024',
        degree: 'BSc (Hons) in Computing',
        institution: 'Coventry University, UK',
        description:
            'Specialised in full-stack development, algorithms, cloud computing, mobile app development and software engineering.',
        align: 'top',
    },
    {
        period: '2024 - Present',
        degree: 'MSc in Information Technology Management',
        institution: 'Deakin University, Australia',
        description:
            'Advanced IT management, enterprise systems, digital strategy, project management and emerging technologies.',
        align: 'bottom',
    },
];

export default function Education({ data }: { data?: EduItem[] }) {
    const education = data && data.length ? data : fallbackEducation;
    const wrapRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        const sticky = stickyRef.current;
        const track = trackRef.current;
        const line = lineRef.current;
        if (!wrap || !sticky || !track || !line) return;
        if (window.innerWidth < 768) return;

        // Each item = 50vw so 2 fill the screen exactly
        const ITEM_W = sticky.clientWidth / 2;
        // Scroll by 2 item widths to reveal items 3 & 4
        const tot = ITEM_W * 2;

        wrap.style.height = `${window.innerHeight + tot + 100}px`;

        const items = Array.from(
            track.querySelectorAll<HTMLElement>('.edu-item'),
        );
        const dots = Array.from(
            track.querySelectorAll<HTMLElement>('.edu-dot'),
        );

        // First 2 fully visible on arrival
        items.forEach((el, i) => {
            el.style.opacity = i < 2 ? '1' : '0';
            el.style.transform =
                i < 2
                    ? 'translateY(0px)'
                    : `translateY(${education[i].align === 'top' ? -35 : 35}px)`;
        });
        dots.forEach((el, i) => {
            el.style.opacity = i < 2 ? '1' : '0';
            el.style.transform =
                i < 2
                    ? 'translate(-50%,-50%) scale(1)'
                    : 'translate(-50%,-50%) scale(0.3)';
        });

        const st = ScrollTrigger.create({
            trigger: wrap,
            start: 'top top',
            end: `+=${tot + 100}`,
            pin: sticky,
            scrub: 1.2,
            onUpdate: (self) => {
                const p = self.progress;

                // Slide entire track left
                gsap.set(track, { x: -p * tot });

                // Line grows right as we scroll
                gsap.set(line, {
                    scaleX: 0.5 + p * 0.5,
                    transformOrigin: 'left center',
                });

                // Item 2 (Bachelor's) fades in between progress 0.2 → 0.6
                const p2 = Math.max(0, Math.min(1, (p - 0.2) / 0.4));
                items[2].style.opacity = String(p2);
                items[2].style.transform = `translateY(${-35 + p2 * 35}px)`;
                dots[2].style.opacity = String(p2);
                dots[2].style.transform = `translate(-50%,-50%) scale(${0.3 + p2 * 0.7})`;

                // Item 3 (Master's) fades in between progress 0.55 → 0.95
                const p3 = Math.max(0, Math.min(1, (p - 0.55) / 0.4));
                items[3].style.opacity = String(p3);
                items[3].style.transform = `translateY(${35 - p3 * 35}px)`;
                dots[3].style.opacity = String(p3);
                dots[3].style.transform = `translate(-50%,-50%) scale(${0.3 + p3 * 0.7})`;
            },
        });

        const onResize = () => {
            const newW = sticky.clientWidth / 2;
            const newTot = newW * 2;
            wrap.style.height = `${window.innerHeight + newTot + 100}px`;
            st.refresh();
        };
        window.addEventListener('resize', onResize);
        return () => {
            st.kill();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div id="education" ref={wrapRef} className="relative">
            {/* ── DESKTOP ── */}
            <div
                ref={stickyRef}
                className="hidden md:block sticky top-0 h-screen border-t overflow-hidden"
                style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
            >
                {/* Header — fixed top left */}
                <div className="absolute top-0 left-0 px-14 pt-20 z-10">
                    <div className="text-[10px] tracking-[0.38em] uppercase text-or mb-3 flex items-center gap-3">
                        <span className="w-[18px] h-px bg-or" />
                        Education
                    </div>
                    <h2 className="text-[clamp(28px,3.5vw,52px)] font-extrabold leading-[.94] tracking-[-0.03em]">
                        Academic
                        <br />
                        <em className="not-italic font-normal text-fg/40">
                            journey.
                        </em>
                    </h2>
                </div>

                {/* Timeline area — pushed down to avoid header overlap */}
                <div
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ paddingTop: 160 }}
                >
                    <div className="relative w-full" style={{ height: 380 }}>
                        {/* Background line */}
                        <div
                            className="absolute left-0 right-0"
                            style={{
                                top: '50%',
                                height: 1,
                                background: 'rgba(255,94,26,0.1)',
                            }}
                        />

                        {/* Animated orange line */}
                        <div
                            ref={lineRef}
                            className="absolute left-0 right-0"
                            style={{
                                top: '50%',
                                height: 1,
                                background: 'rgba(255,94,26,0.5)',
                                transformOrigin: 'left center',
                                transform: 'scaleX(0.5)',
                            }}
                        />

                        {/* Scrolling track */}
                        <div
                            ref={trackRef}
                            className="absolute top-0 bottom-0 flex"
                            style={{
                                left: 0,
                                width: `${education.length * 50}vw`,
                            }}
                        >
                            {education.map((item, i) => {
                                const isTop = item.align === 'top';
                                return (
                                    <div
                                        key={i}
                                        className="relative flex-shrink-0"
                                        style={{
                                            width: '50vw',
                                            height: '100%',
                                        }}
                                    >
                                        {/* Dot */}
                                        <div
                                            className="edu-dot"
                                            style={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                transform:
                                                    'translate(-50%,-50%)',
                                                zIndex: 10,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 22,
                                                    height: 22,
                                                    borderRadius: '50%',
                                                    background: '#0a0a08',
                                                    border: '2px solid #ff5e1a',
                                                    boxShadow:
                                                        '0 0 0 6px rgba(255,94,26,0.1), 0 0 16px rgba(255,94,26,0.2)',
                                                    position: 'relative',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 4,
                                                        borderRadius: '50%',
                                                        background: '#ff5e1a',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div
                                            className="edu-item"
                                            style={{
                                                position: 'absolute',
                                                left: '8%',
                                                right: '8%',
                                                [isTop ? 'bottom' : 'top']:
                                                    'calc(50% + 36px)',
                                            }}
                                        >
                                            <div
                                                className={`flex flex-col ${isTop ? 'items-start pb-8' : 'items-start pt-8'}`}
                                            >
                                                <span
                                                    className="font-mono text-[11px] tracking-[0.22em] uppercase mb-3 block"
                                                    style={{ color: '#ff5e1a' }}
                                                >
                                                    {item.period}
                                                </span>
                                                <h3
                                                    className="font-extrabold tracking-[-0.025em] leading-[1.15] mb-3"
                                                    style={{
                                                        fontSize:
                                                            'clamp(18px, 2vw, 28px)',
                                                        color: 'rgba(245,240,232,0.92)',
                                                    }}
                                                >
                                                    {item.degree}
                                                </h3>
                                                <span
                                                    className="text-[13px] md:text-[14px] font-semibold mb-3 block"
                                                    style={{
                                                        color: 'rgba(245,240,232,0.4)',
                                                    }}
                                                >
                                                    {item.institution}
                                                </span>
                                                <p
                                                    className="text-[12px] md:text-[13px] leading-[1.8]"
                                                    style={{
                                                        color: 'rgba(245,240,232,0.28)',
                                                    }}
                                                >
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE ── */}
            <div
                className="md:hidden px-6 py-16 border-t"
                style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
            >
                <div className="text-[10px] tracking-[0.38em] uppercase text-or flex items-center gap-3 mb-4">
                    <span className="w-[18px] h-px bg-or" />
                    Education
                </div>
                <h2 className="text-[clamp(32px,8vw,48px)] font-extrabold leading-[.94] tracking-[-0.03em] mb-10">
                    Academic
                    <br />
                    <em className="not-italic font-normal text-fg/40">
                        journey.
                    </em>
                </h2>
                <div className="flex flex-col gap-8">
                    {education.map((item, i) => (
                        <div
                            key={i}
                            className="border-l-2 pl-5"
                            style={{ borderColor: 'rgba(255,94,26,0.4)' }}
                        >
                            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-or block mb-1">
                                {item.period}
                            </span>
                            <h3 className="text-[18px] font-extrabold tracking-[-0.02em] mb-1">
                                {item.degree}
                            </h3>
                            <span className="text-[13px] text-fg/40 font-semibold block mb-2">
                                {item.institution}
                            </span>
                            <p className="text-[12px] text-fg/30 leading-[1.7]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
