'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SignatureTag from '@/components/SignatureTag';

gsap.registerPlugin(ScrollTrigger);

type FormState = 'idle' | 'sending' | 'success' | 'error';

const socials = [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'Twitter / X', href: '#' },
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
                                className="soc-link text-[12px] tracking-[0.1em] uppercase text-fg/30 no-underline py-2.5 border-b flex items-center justify-between transition-colors duration-300 hover:text-or first:border-t"
                                style={{ borderColor: 'var(--line)' }}
                            >
                                {s.label}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-[18px]">
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
                            <div className="mb-[18px]">
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
                            <div className="mb-[18px]">
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
