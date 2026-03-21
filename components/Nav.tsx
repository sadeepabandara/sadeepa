'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlockMate from '@/components/BlockMate';
import SignatureTag from '@/components/SignatureTag';

gsap.registerPlugin(ScrollTrigger);

interface NavProps {
    visible: boolean;
}

const links = [
    { label: 'About', href: 'about' },
    { label: 'Services', href: 'services' },
    { label: 'Projects', href: 'projects' },
    { label: 'Testimonials', href: 'testimonials' },
    { label: 'Contact', href: 'contact' },
];

function MagLink({
    label,
    href,
    active,
    onClick,
}: {
    label: string;
    href: string;
    active: boolean;
    onClick: () => void;
}) {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;
        const STRENGTH = 0.38;
        const onEnter = (e: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, {
                x: (e.clientX - r.left - r.width / 2) * STRENGTH,
                y: (e.clientY - r.top - r.height / 2) * STRENGTH,
                duration: 0.4,
                ease: 'power3.out',
            });
        };
        const onMove = (e: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            gsap.to(btn, {
                x: (e.clientX - r.left - r.width / 2) * STRENGTH,
                y: (e.clientY - r.top - r.height / 2) * STRENGTH,
                duration: 0.2,
                ease: 'power2.out',
            });
        };
        const onLeave = () =>
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.55,
                ease: 'elastic.out(1, 0.5)',
            });
        btn.addEventListener('mouseenter', onEnter as EventListener);
        btn.addEventListener('mousemove', onMove as EventListener);
        btn.addEventListener('mouseleave', onLeave);
        return () => {
            btn.removeEventListener('mouseenter', onEnter as EventListener);
            btn.removeEventListener('mousemove', onMove as EventListener);
            btn.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <button
            ref={btnRef}
            data-nav={href}
            onClick={onClick}
            className="text-[11px] tracking-[0.12em] uppercase font-semibold cursor-none bg-transparent border-none p-0 relative"
            style={{
                color: active ? 'var(--or)' : 'rgba(245,240,232,0.3)',
                transition: 'color 0.2s',
                display: 'inline-block',
                willChange: 'transform',
            }}
        >
            {label}
            {active && (
                <span
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-or"
                    style={{ boxShadow: '0 0 6px rgba(255,94,26,0.8)' }}
                />
            )}
        </button>
    );
}

export default function Nav({ visible }: NavProps) {
    const navRef = useRef<HTMLElement>(null);
    const [active, setActive] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    function scrollTo(id: string) {
        setMenuOpen(false);
        const target = document.getElementById(id);
        if (!target) return;
        setActive(id);
        gsap.to(window, {
            scrollTo: target.getBoundingClientRect().top + window.scrollY,
            duration: 1.2,
            ease: 'power3.inOut',
        });
    }

    useEffect(() => {
        if (!visible) return;
        gsap.fromTo(
            navRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 },
        );

        const st = ScrollTrigger.create({
            onUpdate: (self) => {
                if (menuOpen) return;
                const scroll = self.scroll();
                if (scroll < 80) {
                    gsap.to(navRef.current, { yPercent: 0, duration: 0.4 });
                    return;
                }
                gsap.to(
                    navRef.current,
                    self.direction === 1
                        ? {
                              yPercent: -115,
                              duration: 0.35,
                              ease: 'power2.inOut',
                          }
                        : { yPercent: 0, duration: 0.45, ease: 'power2.out' },
                );
            },
        });

        const onScroll = () =>
            navRef.current?.classList.toggle('scrolled', window.scrollY > 60);
        window.addEventListener('scroll', onScroll);

        const observers = links.map(({ href }) => {
            const el = document.getElementById(href);
            if (!el) return null;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActive(href);
                },
                { rootMargin: '-40% 0px -55% 0px' },
            );
            obs.observe(el);
            return obs;
        });

        return () => {
            st.kill();
            window.removeEventListener('scroll', onScroll);
            observers.forEach((o) => o?.disconnect());
        };
    }, [visible, menuOpen]);

    useEffect(() => {
        import('gsap/ScrollToPlugin').then(({ ScrollToPlugin }) =>
            gsap.registerPlugin(ScrollToPlugin),
        );
    }, []);

    return (
        <>
            <nav
                ref={navRef}
                className="fixed top-0 left-0 right-0 z-[500] px-6 md:px-14 py-5 md:py-6 flex justify-between items-center opacity-0 transition-[background,border-color] duration-300"
            >
                {/* Logo */}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        gsap.to(window, {
                            scrollTo: 0,
                            duration: 1.2,
                            ease: 'power3.inOut',
                        });
                    }}
                    className="no-underline cursor-none z-10"
                >
                    <SignatureTag />
                </a>

                {/* Desktop links */}
                <ul className="hidden md:flex gap-8 list-none">
                    {links.map(({ label, href }) => (
                        <li key={href} className="relative">
                            <MagLink
                                label={label}
                                href={href}
                                active={active === href}
                                onClick={() => scrollTo(href)}
                            />
                        </li>
                    ))}
                </ul>

                {/* BlockMate AI button — replaces Available badge */}
                <div className="hidden md:block">
                    <BlockMate />
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-[5px] p-2 z-10 cursor-pointer bg-transparent border-none"
                    aria-label="Menu"
                >
                    <span
                        className={`block w-5 h-px bg-fg transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}
                    />
                    <span
                        className={`block w-5 h-px bg-fg transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
                    />
                    <span
                        className={`block w-5 h-px bg-fg transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}
                    />
                </button>
            </nav>

            {/* Mobile fullscreen menu */}
            <div
                className={`fixed inset-0 z-[490] flex flex-col items-center justify-center transition-all duration-500 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                style={{
                    background: 'rgba(10,10,8,0.97)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <ul className="flex flex-col items-center gap-8 list-none">
                    {links.map(({ label, href }, i) => (
                        <li key={href} className="overflow-hidden">
                            <button
                                onClick={() => scrollTo(href)}
                                className={`text-[32px] font-extrabold tracking-[-0.02em] uppercase bg-transparent border-none cursor-pointer transition-colors duration-300 ${active === href ? 'text-or' : 'text-fg/70 hover:text-fg'}`}
                                style={{
                                    transitionDelay: menuOpen
                                        ? `${i * 60}ms`
                                        : '0ms',
                                    transform: menuOpen
                                        ? 'translateY(0)'
                                        : 'translateY(40px)',
                                    opacity: menuOpen ? 1 : 0,
                                    transition: `transform 0.5s cubic-bezier(.23,1,.32,1) ${i * 60}ms, opacity 0.5s ease ${i * 60}ms, color 0.3s`,
                                }}
                            >
                                {label}
                            </button>
                        </li>
                    ))}
                </ul>
                {/* BlockMate in mobile menu too */}
                <div
                    className="mt-10"
                    style={{
                        opacity: menuOpen ? 1 : 0,
                        transition: 'opacity 0.5s ease 350ms',
                    }}
                >
                    <BlockMate />
                </div>
            </div>

            <style>{`
                nav.scrolled { background:rgba(10,10,8,0.93); border-bottom:1px solid rgba(255,94,26,0.1); backdrop-filter:blur(14px); }
            `}</style>
        </>
    );
}
