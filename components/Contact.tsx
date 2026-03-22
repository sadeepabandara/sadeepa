'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SignatureTag from '@/components/SignatureTag';

gsap.registerPlugin(ScrollTrigger);

type FormState = 'idle' | 'sending' | 'success' | 'error';

const socials = [
    {
        label: 'GitHub',
        href: 'https://github.com/sadeepabandara',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/sadeepa-bandara',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: 'Instagram',
        href: 'https://instagram.com/sadeepabandara',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
        ),
    },
    {
        label: 'Facebook',
        href: 'https://facebook.com/sadeepabandara',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        label: 'Twitter / X',
        href: 'https://x.com/sadeepabandara',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
];

export default function Contact() {
    const [state, setState] = useState<FormState>('idle');
    const [errorMsg, setError] = useState('');
    const sectionRef = useRef<HTMLElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const serviceRef = useRef<HTMLSelectElement>(null);
    const msgRef = useRef<HTMLTextAreaElement>(null);

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
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    },
                },
            );
        });

        // Stagger form fields when form enters view
        const formFields = sectionRef.current?.querySelectorAll('.form-field');
        if (formFields && formFields.length) {
            gsap.fromTo(
                formFields,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: formFields[0],
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    },
                },
            );
        }
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setState('sending');
        setError('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameRef.current?.value,
                    email: emailRef.current?.value,
                    service: serviceRef.current?.value,
                    message: msgRef.current?.value,
                }),
            });
            if (!res.ok) throw new Error('Failed');
            setState('success');
        } catch {
            setState('error');
            setError('Something went wrong. Please try emailing directly.');
        }
    }

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="px-6 md:px-14 pt-16 md:pt-[120px] pb-12 md:pb-20 bg-bg2 border-t"
            style={{ borderColor: 'var(--line)' }}
        >
            {/* Two-col on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20 items-start mb-12 md:mb-20">
                {/* LEFT */}
                <div>
                    <p className="fu text-[10px] tracking-[0.38em] uppercase text-or mb-6">
                        Ready when you are
                    </p>
                    <h2 className="fu text-[clamp(40px,7vw,100px)] font-extrabold leading-[.88] tracking-[-0.04em] mb-7">
                        Let&apos;s work
                        <br />
                        <em className="not-italic font-normal text-or">
                            together.
                        </em>
                    </h2>
                    <p className="fu text-[14px] leading-[1.85] text-fg/50 mb-8 max-w-[400px]">
                        Have a project in mind? I&apos;d love to hear about it.
                        Drop me a message and let&apos;s make something great.
                    </p>
                    <a
                        href="mailto:hello@sadeepa.me"
                        className="fu inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-or no-underline font-semibold mb-10 group"
                    >
                        hello@sadeepa.me
                        <span className="opacity-40 transition-[opacity,transform] duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                            →
                        </span>
                    </a>
                    <div className="fu flex flex-col">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="soc-link text-[12px] tracking-[0.1em] uppercase text-fg/30 no-underline py-2.5 border-b flex items-center justify-between transition-colors duration-300 hover:text-or first:border-t"
                                style={{ borderColor: 'var(--line)' }}
                            >
                                <span className="flex items-center gap-2.5">
                                    {s.icon}
                                    {s.label}
                                </span>
                                <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    →
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* RIGHT — Form */}
                <div
                    className="fu border border-fg/[0.06]"
                    style={{ background: 'var(--bg3)' }}
                >
                    <div
                        className="px-6 md:px-9 py-6 md:py-8 border-b flex items-center gap-3"
                        style={{ borderColor: 'var(--line)' }}
                    >
                        <span
                            className="w-2 h-2 rounded-full bg-or flex-shrink-0"
                            style={{ boxShadow: '0 0 10px rgba(255,94,26,.5)' }}
                        />
                        <span className="text-[12px] tracking-[0.2em] uppercase text-fg font-bold">
                            Start a Project
                        </span>
                    </div>

                    {state === 'success' ? (
                        <div className="px-6 md:px-9 py-14 text-center">
                            <div className="text-[32px] text-or mb-4">✓</div>
                            <h3 className="text-[18px] font-extrabold mb-2">
                                Message sent!
                            </h3>
                            <p className="text-[13px] text-fg/50 leading-[1.7]">
                                Thanks for reaching out. I&apos;ll get back to
                                you within 24 hours.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="px-6 md:px-9 py-6 md:py-8"
                        >
                            {/* Name + Email: stacked on mobile, 2-col on desktop */}
                            <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-4 mb-[18px]">
                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase text-fg/35 mb-2 font-semibold">
                                        Name
                                    </label>
                                    <input
                                        ref={nameRef}
                                        required
                                        type="text"
                                        placeholder="Your name"
                                        className="form-input w-full text-fg font-syne text-[14px] py-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] tracking-[0.2em] uppercase text-fg/35 mb-2 font-semibold">
                                        Email
                                    </label>
                                    <input
                                        ref={emailRef}
                                        required
                                        type="email"
                                        placeholder="your@email.com"
                                        className="form-input w-full text-fg font-syne text-[14px] py-3"
                                    />
                                </div>
                            </div>
                            <div className="form-field mb-[18px]">
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-fg/35 mb-2 font-semibold">
                                    Service
                                </label>
                                <select
                                    ref={serviceRef}
                                    className="form-input w-full text-fg font-syne text-[14px] py-3 pr-4"
                                >
                                    <option value="">Select a service</option>
                                    <option>UI / UX Design</option>
                                    <option>Web Development</option>
                                    <option>Motion & Animation</option>
                                    <option>Brand Identity</option>
                                    <option>Creative Direction</option>
                                    <option>3D & Immersive</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-field mb-[18px]">
                                <label className="block text-[10px] tracking-[0.2em] uppercase text-fg/35 mb-2 font-semibold">
                                    Message
                                </label>
                                <textarea
                                    ref={msgRef}
                                    required
                                    rows={4}
                                    placeholder="Tell me about your project..."
                                    className="form-input w-full text-fg font-syne text-[14px] py-3 resize-none leading-[1.65]"
                                />
                            </div>
                            {state === 'error' && (
                                <p className="text-[12px] text-or mb-4">
                                    {errorMsg}
                                </p>
                            )}
                            <button
                                type="submit"
                                disabled={state === 'sending'}
                                className="w-full mt-2 bg-or text-bg border-none py-4 font-syne text-[12px] font-extrabold tracking-[0.2em] uppercase flex items-center justify-center gap-2.5 transition-[background,transform] duration-300 hover:bg-or2 hover:-translate-y-px cursor-pointer disabled:opacity-60"
                            >
                                {state === 'sending' ? (
                                    <>
                                        Sending <span>...</span>
                                    </>
                                ) : (
                                    <>
                                        Send Message <span>→</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div
                className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-3"
                style={{ borderColor: 'var(--line)' }}
            >
                <span className="font-mono text-[13px] tracking-[0.06em] text-fg/40">
                    © 2026 Sadeepa — All rights reserved
                </span>
                <span
                    className="inline-flex items-center"
                    style={{ fontFamily: 'var(--font-syne), sans-serif' }}
                >
                    <span
                        className="text-[11px] font-semibold"
                        style={{
                            color: 'rgba(245,240,232,0.3)',
                            marginRight: 5,
                        }}
                    >
                        ©
                    </span>
                    <span
                        className="text-[11px] tracking-[0.12em] uppercase font-semibold"
                        style={{
                            color: 'rgba(245,240,232,0.3)',
                            marginRight: 5,
                        }}
                    >
                        Code by
                    </span>
                    <span
                        className="text-[14px] font-bold tracking-[0.12em] uppercase"
                        style={{ color: 'rgba(245,240,232,0.85)' }}
                    >
                        Sadeepa
                    </span>
                </span>
            </div>
        </section>
    );
}
