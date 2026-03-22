'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const W = 480,
    H = 600;
const BIRD_X = 80,
    BIRD_R = 14;
const GRAVITY = 0.45,
    JUMP = -8.5;
const PIPE_W = 52,
    PIPE_GAP = 155,
    PIPE_SPEED = 2.8;

// Scores go through /api/score — never directly to Supabase from browser

interface Pipe {
    x: number;
    top: number;
    scored: boolean;
}

function useFlappy(
    active: boolean,
    globalBest: number,
    onNewBest: (s: number) => void,
) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const globalBestRef = useRef(globalBest);
    const onNewBestRef = useRef(onNewBest);

    // Keep refs in sync without causing loop restarts
    useEffect(() => {
        globalBestRef.current = globalBest;
    }, [globalBest]);
    useEffect(() => {
        onNewBestRef.current = onNewBest;
    }, [onNewBest]);

    const state = useRef({
        bird: { y: H / 2, vy: 0 },
        pipes: [] as Pipe[],
        score: 0,
        frame: 0,
        phase: 'idle' as 'idle' | 'playing' | 'dead',
        animId: 0,
    });

    const [phase, setPhase] = useState<'idle' | 'playing' | 'dead'>('idle');
    const [score, setScore] = useState(0);

    const reset = useCallback(() => {
        const s = state.current;
        s.bird = { y: H / 2, vy: 0 };
        s.pipes = [];
        s.score = 0;
        s.frame = 0;
        s.phase = 'idle';
        setPhase('idle');
        setScore(0);
    }, []);

    const jump = useCallback(() => {
        const s = state.current;
        if (s.phase === 'idle') {
            s.phase = 'playing';
            setPhase('playing');
        }
        if (s.phase === 'playing') {
            s.bird.vy = JUMP;
        }
        if (s.phase === 'dead') {
            reset();
        }
    }, [reset]);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;

        const spawnPipe = () => {
            const top = 80 + Math.random() * (H - PIPE_GAP - 160);
            state.current.pipes.push({ x: W + PIPE_W, top, scored: false });
        };

        const draw = () => {
            const s = state.current;
            ctx.clearRect(0, 0, W, H);

            ctx.fillStyle = '#0a0a08';
            ctx.fillRect(0, 0, W, H);

            ctx.fillStyle = 'rgba(255,94,26,0.04)';
            for (let x = 0; x < W; x += 30)
                for (let y = 0; y < H; y += 30) ctx.fillRect(x, y, 1.5, 1.5);

            ctx.fillStyle = 'rgba(255,94,26,0.15)';
            ctx.fillRect(0, H - 40, W, 1);
            ctx.fillStyle = 'rgba(255,94,26,0.05)';
            ctx.fillRect(0, H - 40, W, 40);

            s.pipes.forEach((p) => {
                const g1 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
                g1.addColorStop(0, 'rgba(255,94,26,0.7)');
                g1.addColorStop(1, 'rgba(180,50,0,0.7)');
                ctx.fillStyle = g1;
                ctx.beginPath();
                ctx.roundRect(p.x, 0, PIPE_W, p.top - 8, [0, 0, 6, 6]);
                ctx.fill();
                ctx.fillStyle = '#ff5e1a';
                ctx.beginPath();
                ctx.roundRect(p.x - 4, p.top - 20, PIPE_W + 8, 16, 4);
                ctx.fill();

                const botY = p.top + PIPE_GAP;
                const g2 = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
                g2.addColorStop(0, 'rgba(255,94,26,0.7)');
                g2.addColorStop(1, 'rgba(180,50,0,0.7)');
                ctx.fillStyle = g2;
                ctx.beginPath();
                ctx.roundRect(
                    p.x,
                    botY + 20,
                    PIPE_W,
                    H - botY - 20 - 40,
                    [6, 6, 0, 0],
                );
                ctx.fill();
                ctx.fillStyle = '#ff5e1a';
                ctx.beginPath();
                ctx.roundRect(p.x - 4, botY + 4, PIPE_W + 8, 16, 4);
                ctx.fill();
            });

            const angle = Math.max(-0.5, Math.min(1.2, s.bird.vy * 0.06));
            ctx.save();
            ctx.translate(BIRD_X, s.bird.y);
            ctx.rotate(angle);
            const grd = ctx.createRadialGradient(0, 0, 2, 0, 0, BIRD_R + 8);
            grd.addColorStop(0, 'rgba(255,94,26,0.3)');
            grd.addColorStop(1, 'transparent');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(0, 0, BIRD_R + 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ff5e1a';
            ctx.beginPath();
            ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.beginPath();
            ctx.arc(-3, -4, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0a0a08';
            ctx.beginPath();
            ctx.arc(5, -3, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(6, -4, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffb347';
            ctx.beginPath();
            ctx.moveTo(BIRD_R - 2, -2);
            ctx.lineTo(BIRD_R + 7, 0);
            ctx.lineTo(BIRD_R - 2, 3);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.fillStyle = 'rgba(245,240,232,0.9)';
            ctx.font = "bold 36px 'Courier New', monospace";
            ctx.textAlign = 'center';
            ctx.fillText(String(s.score), W / 2, 60);

            if (s.phase === 'idle') {
                ctx.fillStyle = 'rgba(255,94,26,0.8)';
                ctx.font = "13px 'Courier New', monospace";
                ctx.fillText('TAP / SPACE / CLICK TO START', W / 2, H / 2 + 60);
                const pulse = (Math.sin(Date.now() * 0.004) + 1) * 0.5;
                ctx.strokeStyle = `rgba(255,94,26,${0.2 + pulse * 0.4})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(BIRD_X, H / 2, BIRD_R + 10 + pulse * 8, 0, Math.PI * 2);
                ctx.stroke();
            }

            if (s.phase === 'dead') {
                ctx.fillStyle = 'rgba(10,10,8,0.7)';
                ctx.fillRect(0, 0, W, H);
                ctx.fillStyle = '#ff5e1a';
                ctx.font = "bold 28px 'Courier New', monospace";
                ctx.fillText('GAME OVER', W / 2, H / 2 - 40);
                ctx.fillStyle = 'rgba(245,240,232,0.7)';
                ctx.font = "16px 'Courier New', monospace";
                ctx.fillText(`Score: ${s.score}`, W / 2, H / 2);
                ctx.fillText(
                    `Global Best: ${globalBestRef.current}`,
                    W / 2,
                    H / 2 + 28,
                );
                ctx.fillStyle = 'rgba(255,94,26,0.8)';
                ctx.font = "12px 'Courier New', monospace";
                ctx.fillText('TAP TO RESTART', W / 2, H / 2 + 70);
            }
        };

        const tick = () => {
            const s = state.current;
            if (s.phase === 'playing') {
                s.bird.vy += GRAVITY;
                s.bird.y += s.bird.vy;
                s.frame++;

                if (s.frame % 90 === 0) spawnPipe();
                s.pipes.forEach((p) => {
                    p.x -= PIPE_SPEED;
                });
                s.pipes = s.pipes.filter((p) => p.x > -PIPE_W - 10);

                s.pipes.forEach((p) => {
                    if (!p.scored && p.x + PIPE_W < BIRD_X) {
                        p.scored = true;
                        s.score++;
                        setScore(s.score);
                    }
                });

                // ground/ceiling
                if (s.bird.y + BIRD_R > H - 40 || s.bird.y - BIRD_R < 0) {
                    s.phase = 'dead';
                    setPhase('dead');
                    // save via ref — zero re-renders
                    if (s.score > 0 && s.score > globalBestRef.current) {
                        onNewBestRef.current(s.score);
                    }
                }

                // pipes
                for (const p of s.pipes) {
                    if (s.phase !== 'playing') break;
                    if (
                        BIRD_X + BIRD_R > p.x + 4 &&
                        BIRD_X - BIRD_R < p.x + PIPE_W - 4
                    ) {
                        if (
                            s.bird.y - BIRD_R < p.top - 8 ||
                            s.bird.y + BIRD_R > p.top + PIPE_GAP + 4
                        ) {
                            s.phase = 'dead';
                            setPhase('dead');
                            if (
                                s.score > 0 &&
                                s.score > globalBestRef.current
                            ) {
                                onNewBestRef.current(s.score);
                            }
                        }
                    }
                }
            }

            draw();
            s.animId = requestAnimationFrame(tick);
        };

        state.current.animId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(state.current.animId);
    }, [active]); // ← ONLY active — this is the key

    return { canvasRef, phase, score, jump };
}

// ── Main component ─────────────────────────────────────────
export default function FlappyGame() {
    const [open, setOpen] = useState(false);
    const [best, setBest] = useState(0);
    const bestRef = useRef(0);

    // Load global best via our own API — no Supabase keys in browser
    useEffect(() => {
        fetch('/api/score')
            .then((r) => r.json())
            .then((d) => {
                const b = d?.globalBest ?? 0;
                bestRef.current = b;
                setBest(b);
            })
            .catch(() => {});
    }, []);

    // Called only when a new global best is set — goes through server API
    const onNewBest = useCallback((score: number) => {
        bestRef.current = score;
        setBest(score);
        fetch('/api/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score }),
        }).catch(() => {});
    }, []);

    const { canvasRef, phase, score, jump } = useFlappy(
        open,
        bestRef.current,
        onNewBest,
    );

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
            if (e.code === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, jump]);

    return (
        <>
            {/* Section */}
            <section
                className="px-6 md:px-14 py-16 md:py-20 border-t flex flex-col md:flex-row items-center justify-between gap-8"
                style={{ borderColor: 'var(--line)', background: 'var(--bg2)' }}
            >
                <div>
                    <div className="text-[10px] tracking-[0.38em] uppercase text-or mb-3 flex items-center gap-3">
                        <span className="w-[18px] h-px bg-or" />
                        Mini Game
                    </div>
                    <h2 className="text-[clamp(24px,3.5vw,48px)] font-extrabold leading-[.95] tracking-[-0.03em] mb-3">
                        Need a break?
                        <br />
                        <em className="not-italic font-normal text-fg/40">
                            Play a round.
                        </em>
                    </h2>
                    <p className="text-[13px] text-fg/35 leading-[1.75] max-w-[340px]">
                        A little Flappy Bird built into the portfolio. Tap,
                        click or press Space to flap. Can you beat the global
                        best?
                    </p>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="group relative flex items-center gap-4 px-8 py-5 border border-or/30 hover:border-or/70 transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
                    style={{ background: 'rgba(255,94,26,0.05)' }}
                >
                    <div
                        className="w-12 h-12 rounded-full border border-or/40 flex items-center justify-center group-hover:border-or transition-colors duration-300"
                        style={{ background: 'rgba(255,94,26,0.1)' }}
                    >
                        <svg
                            width="16"
                            height="18"
                            viewBox="0 0 16 18"
                            fill="none"
                        >
                            <path d="M2 1.5L14 9L2 16.5V1.5Z" fill="#ff5e1a" />
                        </svg>
                    </div>
                    <div className="text-left">
                        <div className="text-[13px] font-extrabold tracking-[0.08em] uppercase text-fg/80">
                            Play Now
                        </div>
                        {best > 0 ? (
                            <div className="font-mono text-[10px] text-or/60 tracking-[0.1em] mt-0.5">
                                🏆 Global Best: {best}
                            </div>
                        ) : (
                            <div className="font-mono text-[10px] text-or/30 tracking-[0.1em] mt-0.5">
                                Be the first to score!
                            </div>
                        )}
                    </div>
                </button>
            </section>

            {/* Game overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-[8500] flex items-center justify-center"
                    style={{
                        background: 'rgba(10,10,8,0.92)',
                        backdropFilter: 'blur(12px)',
                    }}
                    onClick={jump}
                >
                    <div
                        className="relative flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between w-full mb-3 px-1">
                            <div className="flex items-center gap-3">
                                <span
                                    className="font-mono text-[10px] tracking-[0.2em] uppercase"
                                    style={{ color: 'rgba(255,94,26,0.6)' }}
                                >
                                    Flappy
                                </span>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg/20">
                                    Score: {score}
                                </span>
                                {best > 0 && (
                                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-fg/20">
                                        🏆 Best: {best}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="font-mono text-[11px] tracking-[0.1em] uppercase text-fg/30 hover:text-or transition-colors duration-200 cursor-none"
                            >
                                ESC / Close
                            </button>
                        </div>

                        <canvas
                            ref={canvasRef}
                            width={W}
                            height={H}
                            onClick={jump}
                            style={{
                                border: '1px solid rgba(255,94,26,0.2)',
                                borderRadius: 8,
                                cursor: 'none',
                                maxWidth: '90vw',
                                maxHeight: '80vh',
                            }}
                        />
                        <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-fg/15 mt-3">
                            Space / Click / Tap to flap
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
