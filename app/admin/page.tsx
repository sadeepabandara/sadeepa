'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/admin/dashboard');
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: '#0a0a08' }}
        >
            <div className="w-full max-w-md px-8">
                {/* Logo */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <img
                            src="/favicon.svg"
                            alt="Sadeepa"
                            width={36}
                            height={36}
                        />
                        <span
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 18,
                                fontWeight: 800,
                                letterSpacing: '0.15em',
                                color: 'rgba(245,240,232,0.85)',
                                textTransform: 'uppercase',
                            }}
                        >
                            SADEEPA<span style={{ color: '#ff5e1a' }}>.</span>
                        </span>
                    </div>
                    <p
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 10,
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,94,26,0.6)',
                        }}
                    >
                        Admin Dashboard
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={login}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                    }}
                >
                    <div>
                        <label
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 10,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'rgba(245,240,232,0.3)',
                                display: 'block',
                                marginBottom: 8,
                            }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(245,240,232,0.04)',
                                border: '1px solid rgba(255,94,26,0.2)',
                                color: 'rgba(245,240,232,0.85)',
                                fontFamily: 'monospace',
                                fontSize: 13,
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor =
                                    'rgba(255,94,26,0.6)')
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor =
                                    'rgba(255,94,26,0.2)')
                            }
                        />
                    </div>
                    <div>
                        <label
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 10,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: 'rgba(245,240,232,0.3)',
                                display: 'block',
                                marginBottom: 8,
                            }}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'rgba(245,240,232,0.04)',
                                border: '1px solid rgba(255,94,26,0.2)',
                                color: 'rgba(245,240,232,0.85)',
                                fontFamily: 'monospace',
                                fontSize: 13,
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor =
                                    'rgba(255,94,26,0.6)')
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor =
                                    'rgba(255,94,26,0.2)')
                            }
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 11,
                                color: '#f87171',
                                padding: '10px 14px',
                                background: 'rgba(248,113,113,0.08)',
                                border: '1px solid rgba(248,113,113,0.2)',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: 8,
                            padding: '14px 24px',
                            background: loading
                                ? 'rgba(255,94,26,0.4)'
                                : '#ff5e1a',
                            color: '#0a0a08',
                            fontFamily: 'monospace',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                </form>

                <p
                    style={{
                        marginTop: 32,
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        fontSize: 9,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.12)',
                    }}
                >
                    Restricted access — Sadeepa Bandara only
                </p>
            </div>
        </div>
    );
}
