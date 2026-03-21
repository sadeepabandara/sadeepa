'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SYSTEM_PROMPT = `You are BlockMate, a personal AI assistant embedded in Sadeepa Bandara's portfolio website. You speak on behalf of Sadeepa and answer questions about him in a confident, friendly, and professional tone.

Here is everything you know about Sadeepa:
- Full name: Sadeepa Bandara
- Age: 24 years old
- From: Sri Lanka, currently based in Australia
- Role: Software Developer & Designer — an investor, entrepreneur, developer and designer
- Email: sadeepadexter@gmail.com
- Website: sadeepa.me
- GitHub: github.com/sadeepabandara
- LinkedIn: linkedin.com/in/sadeepa-bandara

Education:
- Diploma in Information Technology — ESOFT Metro Campus, Sri Lanka (2021–2022)
- Higher Diploma in Information Technology — ESOFT Metro Campus, Sri Lanka (2022–2023)
- BSc (Hons) in Computing — Coventry University, UK (2021–2024)
- MSc in Information Technology Management — Deakin University, Australia (2024–Present)

Skills & Tech Stack:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Figma
- Backend: Node.js, Python, PostgreSQL, Firebase, Docker, AWS
- Other: Git, SEO, Video Editing, Game Development, Graphic Design

Services offered:
- Web Design & Development (React, Next.js, Tailwind)
- Search Engine Optimization
- Graphic Design
- Software Development
- Video Editing
- Game Development

Key facts:
- Passionate about innovation, investing (Warren Buffett philosophy) and growth
- Also studying forex trading and video editing
- Available for freelance work and collaborations

Keep answers concise (2-4 sentences max). If asked something you don't know, say you'll let Sadeepa answer that personally. Never make up specific details not listed above. Always stay in character as BlockMate.`;

function BlockMateLogo({ size = 28 }: { size?: number }) {
    return (
        <Image
            src="/blockmate-logo.svg"
            alt="BlockMate"
            width={size}
            height={size}
            style={{ display: 'block' }}
        />
    );
}

function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-or"
                    style={{
                        animation: `bm-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                        opacity: 0.7,
                    }}
                />
            ))}
        </div>
    );
}

export default function BlockMate() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content:
                "Hey! I'm BlockMate 👋 Sadeepa's personal AI. Ask me anything about his work, skills, or how to get in touch.",
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const newMessages: Message[] = [
            ...messages,
            { role: 'user', content: text },
        ];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system: SYSTEM_PROMPT,
                    messages: newMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });
            const data = await res.json();
            const reply = data.reply ?? "I couldn't get a response. Try again!";
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: reply },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Connection issue! Please try again in a moment.',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes bm-bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-5px); }
                }
                @keyframes bm-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(0.85); }
                }
                @keyframes bm-slidein {
                    from { opacity: 0; transform: translateY(12px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes bm-appear {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .bm-panel { animation: bm-slidein 0.35s cubic-bezier(0.23,1,0.32,1) forwards; }
                .bm-msg   { animation: bm-appear  0.28s ease-out forwards; }
                .bm-trigger { transition: transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease; }
                .bm-trigger:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(255,94,26,0.35); }
            `}</style>

            {/* Trigger button */}
            <div className="relative">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="bm-trigger relative flex items-center justify-center rounded-full border border-or/30 hover:border-or/70"
                    style={{
                        width: 38,
                        height: 38,
                        background: 'rgba(10,10,8,0.8)',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <BlockMateLogo size={22} />
                    {!open && (
                        <span
                            className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-or border-2 border-bg"
                            style={{
                                animation: 'bm-pulse 2s ease-in-out infinite',
                            }}
                        />
                    )}
                </button>

                {/* Chat panel */}
                {open && (
                    <div
                        ref={panelRef}
                        className="bm-panel absolute top-12 right-0 z-[600] flex flex-col"
                        style={{
                            width: 'min(380px, calc(100vw - 48px))',
                            height: 480,
                            background: 'rgba(10,10,8,0.97)',
                            border: '1px solid rgba(255,94,26,0.2)',
                            backdropFilter: 'blur(20px)',
                            boxShadow:
                                '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,94,26,0.06)',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                            style={{ borderColor: 'rgba(255,94,26,0.12)' }}
                        >
                            <div className="flex items-center gap-3">
                                <BlockMateLogo size={26} />
                                <div>
                                    <div className="text-[12px] font-bold tracking-[0.05em] text-fg">
                                        BlockMate
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full bg-green-400"
                                            style={{
                                                animation:
                                                    'bm-pulse 2s infinite',
                                            }}
                                        />
                                        <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-fg/30">
                                            Sadeepa's AI
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-7 h-7 flex items-center justify-center text-fg/30 hover:text-or transition-colors duration-200 text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`bm-msg flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {m.role === 'assistant' && (
                                        <div className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0">
                                            <BlockMateLogo size={20} />
                                        </div>
                                    )}
                                    <div
                                        className="max-w-[82%] text-[12px] leading-[1.7]"
                                        style={{
                                            padding: '9px 13px',
                                            background:
                                                m.role === 'user'
                                                    ? 'rgba(255,94,26,0.15)'
                                                    : 'rgba(245,240,232,0.05)',
                                            border:
                                                m.role === 'user'
                                                    ? '1px solid rgba(255,94,26,0.3)'
                                                    : '1px solid rgba(245,240,232,0.07)',
                                            color:
                                                m.role === 'user'
                                                    ? 'rgba(255,94,26,0.95)'
                                                    : 'rgba(245,240,232,0.8)',
                                            borderRadius:
                                                m.role === 'user'
                                                    ? '12px 12px 2px 12px'
                                                    : '12px 12px 12px 2px',
                                        }}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="bm-msg flex justify-start items-center gap-2">
                                    <div className="w-5 h-5 flex-shrink-0">
                                        <BlockMateLogo size={20} />
                                    </div>
                                    <div
                                        style={{
                                            background:
                                                'rgba(245,240,232,0.05)',
                                            border: '1px solid rgba(245,240,232,0.07)',
                                            borderRadius: '12px 12px 12px 2px',
                                        }}
                                    >
                                        <TypingDots />
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div
                            className="flex items-center gap-2 px-3 py-3 border-t flex-shrink-0"
                            style={{ borderColor: 'rgba(255,94,26,0.12)' }}
                        >
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && send()}
                                placeholder="Ask about Sadeepa..."
                                className="flex-1 bg-transparent text-[12px] text-fg/80 placeholder:text-fg/20 outline-none font-mono tracking-[0.03em]"
                            />
                            <button
                                onClick={send}
                                disabled={!input.trim() || loading}
                                className="w-8 h-8 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                                style={{
                                    background:
                                        input.trim() && !loading
                                            ? '#ff5e1a'
                                            : 'rgba(255,94,26,0.1)',
                                    color:
                                        input.trim() && !loading
                                            ? '#0a0a08'
                                            : 'rgba(255,94,26,0.3)',
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                >
                                    <path
                                        d="M1 7h12M7 1l6 6-6 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="px-4 pb-2.5 flex-shrink-0">
                            <p className="font-mono text-[8px] tracking-[0.12em] text-fg/15 text-center uppercase">
                                Powered by BlockMate AI · Built for Sadeepa
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
