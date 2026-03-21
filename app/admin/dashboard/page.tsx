'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Tab =
    | 'overview'
    | 'projects'
    | 'testimonials'
    | 'services'
    | 'education'
    | 'techstack'
    | 'about'
    | 'messages'
    | 'quote';

// ── Stat card ──────────────────────────────────────────────
function StatCard({
    label,
    value,
    sub,
}: {
    label: string;
    value: string | number;
    sub?: string;
}) {
    return (
        <div
            style={{
                padding: '20px 24px',
                background: 'rgba(245,240,232,0.03)',
                border: '1px solid rgba(255,94,26,0.12)',
            }}
        >
            <div
                style={{
                    fontFamily: 'monospace',
                    fontSize: 9,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,94,26,0.5)',
                    marginBottom: 8,
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: 36,
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    color: '#ff5e1a',
                    lineHeight: 1,
                }}
            >
                {value}
            </div>
            {sub && (
                <div
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        color: 'rgba(245,240,232,0.2)',
                        marginTop: 6,
                    }}
                >
                    {sub}
                </div>
            )}
        </div>
    );
}

// ── Input ──────────────────────────────────────────────────
function Input({
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    rows = 0,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    placeholder?: string;
    rows?: number;
}) {
    const base: React.CSSProperties = {
        width: '100%',
        padding: '10px 14px',
        boxSizing: 'border-box',
        background: 'rgba(245,240,232,0.04)',
        border: '1px solid rgba(255,94,26,0.15)',
        color: 'rgba(245,240,232,0.85)',
        fontFamily: 'monospace',
        fontSize: 13,
        outline: 'none',
        resize: 'vertical' as const,
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
                style={{
                    fontFamily: 'monospace',
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,240,232,0.3)',
                }}
            >
                {label}
            </label>
            {rows > 0 ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    style={base}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={base}
                />
            )}
        </div>
    );
}

// ── Btn ────────────────────────────────────────────────────
function Btn({
    children,
    onClick,
    variant = 'primary',
    small = false,
    disabled = false,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'danger' | 'ghost';
    small?: boolean;
    disabled?: boolean;
}) {
    const styles: Record<string, React.CSSProperties> = {
        primary: { background: '#ff5e1a', color: '#0a0a08' },
        danger: {
            background: 'rgba(248,113,113,0.15)',
            color: '#f87171',
            border: '1px solid rgba(248,113,113,0.25)',
        },
        ghost: {
            background: 'transparent',
            color: 'rgba(245,240,232,0.4)',
            border: '1px solid rgba(245,240,232,0.1)',
        },
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                ...styles[variant],
                padding: small ? '6px 14px' : '10px 20px',
                fontFamily: 'monospace',
                fontSize: small ? 10 : 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: styles[variant].border ?? 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                transition: 'opacity 0.2s',
            }}
        >
            {children}
        </button>
    );
}

// ── Modal ──────────────────────────────────────────────────
function Modal({
    title,
    children,
    onClose,
}: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(10,10,8,0.85)',
                backdropFilter: 'blur(8px)',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: 560,
                    maxHeight: '90vh',
                    overflow: 'auto',
                    background: '#0f0e0b',
                    border: '1px solid rgba(255,94,26,0.2)',
                    padding: 32,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 24,
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 11,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,94,26,0.8)',
                        }}
                    >
                        {title}
                    </span>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgba(245,240,232,0.3)',
                            fontSize: 20,
                            cursor: 'pointer',
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ── PROJECTS TAB ───────────────────────────────────────────
function ProjectsTab() {
    const [rows, setRows] = useState<any[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({
        number: '',
        title: '',
        tags: '',
        year: '',
        url: '',
        image: '',
    });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('sort_order');
        setRows(data ?? []);
    }, []);
    useEffect(() => {
        load();
    }, [load]);

    const openNew = () => {
        setEditing(null);
        setForm({
            number: '',
            title: '',
            tags: '',
            year: '',
            url: '',
            image: '',
        });
        setModal(true);
    };
    const openEdit = (r: any) => {
        setEditing(r);
        setForm({
            number: r.number,
            title: r.title,
            tags: r.tags.join(', '),
            year: r.year,
            url: r.url ?? '',
            image: r.image ?? '',
        });
        setModal(true);
    };

    const save = async () => {
        setSaving(true);
        const payload = {
            number: form.number,
            title: form.title,
            tags: form.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
            year: form.year,
            url: form.url || null,
            image: form.image || null,
        };
        if (editing)
            await supabase
                .from('projects')
                .update(payload)
                .eq('id', editing.id);
        else
            await supabase
                .from('projects')
                .insert({ ...payload, sort_order: rows.length + 1 });
        setSaving(false);
        setModal(false);
        load();
    };

    const del = async (id: string) => {
        if (!confirm('Delete this project?')) return;
        await supabase.from('projects').delete().eq('id', id);
        load();
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }}
            >
                <span
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.3)',
                    }}
                >
                    {rows.length} projects
                </span>
                <Btn onClick={openNew}>+ Add Project</Btn>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map((r) => (
                    <div
                        key={r.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            padding: '14px 18px',
                            background: 'rgba(245,240,232,0.02)',
                            border: '1px solid rgba(255,94,26,0.08)',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 10,
                                color: 'rgba(255,94,26,0.5)',
                                minWidth: 32,
                            }}
                        >
                            {r.number}
                        </span>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: 'rgba(245,240,232,0.85)',
                                    marginBottom: 3,
                                }}
                            >
                                {r.title}
                            </div>
                            <div
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: 10,
                                    color: 'rgba(245,240,232,0.25)',
                                }}
                            >
                                {r.tags.join(' · ')} · {r.year}
                            </div>
                        </div>
                        {r.url && (
                            <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: 9,
                                    color: 'rgba(255,94,26,0.5)',
                                    textDecoration: 'none',
                                }}
                            >
                                ↗ Link
                            </a>
                        )}
                        <Btn onClick={() => openEdit(r)} variant="ghost" small>
                            Edit
                        </Btn>
                        <Btn onClick={() => del(r.id)} variant="danger" small>
                            Del
                        </Btn>
                    </div>
                ))}
            </div>
            {modal && (
                <Modal
                    title={editing ? 'Edit Project' : 'New Project'}
                    onClose={() => setModal(false)}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14,
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 14,
                            }}
                        >
                            <Input
                                label="Number"
                                value={form.number}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, number: v }))
                                }
                                placeholder="001"
                            />
                            <Input
                                label="Year"
                                value={form.year}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, year: v }))
                                }
                                placeholder="2025"
                            />
                        </div>
                        <Input
                            label="Title"
                            value={form.title}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, title: v }))
                            }
                            placeholder="Project name"
                        />
                        <Input
                            label="Tags (comma separated)"
                            value={form.tags}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, tags: v }))
                            }
                            placeholder="React, Design, 2025"
                        />
                        <Input
                            label="URL"
                            value={form.url}
                            onChange={(v) => setForm((f) => ({ ...f, url: v }))}
                            placeholder="https://..."
                        />
                        <Input
                            label="Image URL"
                            value={form.image}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, image: v }))
                            }
                            placeholder="https://... (thumbnail)"
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 10,
                                marginTop: 8,
                            }}
                        >
                            <Btn
                                onClick={() => setModal(false)}
                                variant="ghost"
                            >
                                Cancel
                            </Btn>
                            <Btn onClick={save} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Btn>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── TESTIMONIALS TAB ───────────────────────────────────────
function TestimonialsTab() {
    const [rows, setRows] = useState<any[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({
        name: '',
        role: '',
        company: '',
        initials: '',
        text: '',
    });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        const { data } = await supabase
            .from('testimonials')
            .select('*')
            .order('sort_order');
        setRows(data ?? []);
    }, []);
    useEffect(() => {
        load();
    }, [load]);

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', role: '', company: '', initials: '', text: '' });
        setModal(true);
    };
    const openEdit = (r: any) => {
        setEditing(r);
        setForm({
            name: r.name,
            role: r.role,
            company: r.company,
            initials: r.initials,
            text: r.text,
        });
        setModal(true);
    };

    const save = async () => {
        setSaving(true);
        const payload = {
            name: form.name,
            role: form.role,
            company: form.company,
            initials: form.initials,
            text: form.text,
        };
        if (editing)
            await supabase
                .from('testimonials')
                .update(payload)
                .eq('id', editing.id);
        else
            await supabase
                .from('testimonials')
                .insert({ ...payload, sort_order: rows.length + 1 });
        setSaving(false);
        setModal(false);
        load();
    };

    const del = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;
        await supabase.from('testimonials').delete().eq('id', id);
        load();
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }}
            >
                <span
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.3)',
                    }}
                >
                    {rows.length} testimonials
                </span>
                <Btn onClick={openNew}>+ Add Testimonial</Btn>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map((r) => (
                    <div
                        key={r.id}
                        style={{
                            padding: '16px 18px',
                            background: 'rgba(245,240,232,0.02)',
                            border: '1px solid rgba(255,94,26,0.08)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 8,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: 'rgba(255,94,26,0.15)',
                                        border: '1px solid rgba(255,94,26,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'monospace',
                                        fontSize: 10,
                                        fontWeight: 700,
                                        color: '#ff5e1a',
                                    }}
                                >
                                    {r.initials}
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: 'rgba(245,240,232,0.85)',
                                        }}
                                    >
                                        {r.name}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: 10,
                                            color: 'rgba(245,240,232,0.25)',
                                        }}
                                    >
                                        {r.role} · {r.company}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Btn
                                    onClick={() => openEdit(r)}
                                    variant="ghost"
                                    small
                                >
                                    Edit
                                </Btn>
                                <Btn
                                    onClick={() => del(r.id)}
                                    variant="danger"
                                    small
                                >
                                    Del
                                </Btn>
                            </div>
                        </div>
                        <p
                            style={{
                                fontSize: 12,
                                color: 'rgba(245,240,232,0.3)',
                                lineHeight: 1.7,
                                margin: 0,
                            }}
                        >
                            {r.text}
                        </p>
                    </div>
                ))}
            </div>
            {modal && (
                <Modal
                    title={editing ? 'Edit Testimonial' : 'New Testimonial'}
                    onClose={() => setModal(false)}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14,
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 80px',
                                gap: 14,
                            }}
                        >
                            <Input
                                label="Name"
                                value={form.name}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, name: v }))
                                }
                            />
                            <Input
                                label="Initials"
                                value={form.initials}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, initials: v }))
                                }
                                placeholder="AB"
                            />
                        </div>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: 14,
                            }}
                        >
                            <Input
                                label="Role"
                                value={form.role}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, role: v }))
                                }
                            />
                            <Input
                                label="Company"
                                value={form.company}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, company: v }))
                                }
                            />
                        </div>
                        <Input
                            label="Testimonial Text"
                            value={form.text}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, text: v }))
                            }
                            rows={4}
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 10,
                                marginTop: 8,
                            }}
                        >
                            <Btn
                                onClick={() => setModal(false)}
                                variant="ghost"
                            >
                                Cancel
                            </Btn>
                            <Btn onClick={save} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Btn>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── SERVICES TAB ───────────────────────────────────────────
function ServicesTab() {
    const [rows, setRows] = useState<any[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({
        number: '',
        icon: '',
        title: '',
        description: '',
        tags: '',
    });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        const { data } = await supabase
            .from('services')
            .select('*')
            .order('sort_order');
        setRows(data ?? []);
    }, []);
    useEffect(() => {
        load();
    }, [load]);

    const openNew = () => {
        setEditing(null);
        setForm({
            number: '',
            icon: '◈',
            title: '',
            description: '',
            tags: '',
        });
        setModal(true);
    };
    const openEdit = (r: any) => {
        setEditing(r);
        setForm({
            number: r.number,
            icon: r.icon,
            title: r.title,
            description: r.description,
            tags: r.tags.join(', '),
        });
        setModal(true);
    };

    const save = async () => {
        setSaving(true);
        const payload = {
            number: form.number,
            icon: form.icon,
            title: form.title,
            description: form.description,
            tags: form.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
        };
        if (editing)
            await supabase
                .from('services')
                .update(payload)
                .eq('id', editing.id);
        else
            await supabase.from('services').insert({
                ...payload,
                sort_order: rows.length + 1,
                active: true,
            });
        setSaving(false);
        setModal(false);
        load();
    };

    const del = async (id: string) => {
        if (!confirm('Delete this service?')) return;
        await supabase.from('services').delete().eq('id', id);
        load();
    };

    const toggle = async (id: string, active: boolean) => {
        await supabase
            .from('services')
            .update({ active: !active })
            .eq('id', id);
        load();
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }}
            >
                <span
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.3)',
                    }}
                >
                    {rows.length} services
                </span>
                <Btn onClick={openNew}>+ Add Service</Btn>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map((r) => (
                    <div
                        key={r.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '14px 18px',
                            background: 'rgba(245,240,232,0.02)',
                            border: `1px solid ${r.active ? 'rgba(255,94,26,0.08)' : 'rgba(245,240,232,0.04)'}`,
                            opacity: r.active ? 1 : 0.5,
                        }}
                    >
                        <span style={{ fontSize: 20, minWidth: 28 }}>
                            {r.icon}
                        </span>
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: 'rgba(245,240,232,0.85)',
                                    marginBottom: 3,
                                }}
                            >
                                {r.title}
                            </div>
                            <div
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: 10,
                                    color: 'rgba(245,240,232,0.25)',
                                }}
                            >
                                {r.tags.join(' · ')}
                            </div>
                        </div>
                        <Btn
                            onClick={() => toggle(r.id, r.active)}
                            variant="ghost"
                            small
                        >
                            {r.active ? 'Hide' : 'Show'}
                        </Btn>
                        <Btn onClick={() => openEdit(r)} variant="ghost" small>
                            Edit
                        </Btn>
                        <Btn onClick={() => del(r.id)} variant="danger" small>
                            Del
                        </Btn>
                    </div>
                ))}
            </div>
            {modal && (
                <Modal
                    title={editing ? 'Edit Service' : 'New Service'}
                    onClose={() => setModal(false)}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14,
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '80px 60px 1fr',
                                gap: 14,
                            }}
                        >
                            <Input
                                label="Number"
                                value={form.number}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, number: v }))
                                }
                                placeholder="01"
                            />
                            <Input
                                label="Icon"
                                value={form.icon}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, icon: v }))
                                }
                                placeholder="◈"
                            />
                            <Input
                                label="Title"
                                value={form.title}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, title: v }))
                                }
                            />
                        </div>
                        <Input
                            label="Description"
                            value={form.description}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, description: v }))
                            }
                            rows={3}
                        />
                        <Input
                            label="Tags (comma separated)"
                            value={form.tags}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, tags: v }))
                            }
                            placeholder="React, Design"
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 10,
                                marginTop: 8,
                            }}
                        >
                            <Btn
                                onClick={() => setModal(false)}
                                variant="ghost"
                            >
                                Cancel
                            </Btn>
                            <Btn onClick={save} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Btn>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── EDUCATION TAB ──────────────────────────────────────────
function EducationTab() {
    const [rows, setRows] = useState<any[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({
        period: '',
        degree: '',
        institution: '',
        description: '',
        align: 'top',
    });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        const { data } = await supabase
            .from('education')
            .select('*')
            .order('sort_order');
        setRows(data ?? []);
    }, []);
    useEffect(() => {
        load();
    }, [load]);

    const openNew = () => {
        setEditing(null);
        setForm({
            period: '',
            degree: '',
            institution: '',
            description: '',
            align: 'top',
        });
        setModal(true);
    };
    const openEdit = (r: any) => {
        setEditing(r);
        setForm({
            period: r.period,
            degree: r.degree,
            institution: r.institution,
            description: r.description,
            align: r.align,
        });
        setModal(true);
    };

    const save = async () => {
        setSaving(true);
        const payload = {
            period: form.period,
            degree: form.degree,
            institution: form.institution,
            description: form.description,
            align: form.align,
        };
        if (editing)
            await supabase
                .from('education')
                .update(payload)
                .eq('id', editing.id);
        else
            await supabase
                .from('education')
                .insert({ ...payload, sort_order: rows.length + 1 });
        setSaving(false);
        setModal(false);
        load();
    };

    const del = async (id: string) => {
        if (!confirm('Delete this entry?')) return;
        await supabase.from('education').delete().eq('id', id);
        load();
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }}
            >
                <span
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.3)',
                    }}
                >
                    {rows.length} entries
                </span>
                <Btn onClick={openNew}>+ Add Education</Btn>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map((r) => (
                    <div
                        key={r.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            padding: '14px 18px',
                            background: 'rgba(245,240,232,0.02)',
                            border: '1px solid rgba(255,94,26,0.08)',
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginBottom: 3,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 10,
                                        color: '#ff5e1a',
                                    }}
                                >
                                    {r.period}
                                </span>
                                <span
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 9,
                                        color: 'rgba(255,94,26,0.3)',
                                        border: '1px solid rgba(255,94,26,0.2)',
                                        padding: '1px 6px',
                                    }}
                                >
                                    {r.align}
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: 'rgba(245,240,232,0.85)',
                                    marginBottom: 2,
                                }}
                            >
                                {r.degree}
                            </div>
                            <div
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: 10,
                                    color: 'rgba(245,240,232,0.25)',
                                }}
                            >
                                {r.institution}
                            </div>
                        </div>
                        <Btn onClick={() => openEdit(r)} variant="ghost" small>
                            Edit
                        </Btn>
                        <Btn onClick={() => del(r.id)} variant="danger" small>
                            Del
                        </Btn>
                    </div>
                ))}
            </div>
            {modal && (
                <Modal
                    title={editing ? 'Edit Education' : 'New Education'}
                    onClose={() => setModal(false)}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14,
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 100px',
                                gap: 14,
                            }}
                        >
                            <Input
                                label="Period"
                                value={form.period}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, period: v }))
                                }
                                placeholder="2021 - 2024"
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                }}
                            >
                                <label
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 9,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(245,240,232,0.3)',
                                    }}
                                >
                                    Align
                                </label>
                                <select
                                    value={form.align}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            align: e.target.value,
                                        }))
                                    }
                                    style={{
                                        padding: '10px 14px',
                                        background: 'rgba(245,240,232,0.04)',
                                        border: '1px solid rgba(255,94,26,0.15)',
                                        color: 'rgba(245,240,232,0.85)',
                                        fontFamily: 'monospace',
                                        fontSize: 13,
                                        outline: 'none',
                                    }}
                                >
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                            </div>
                        </div>
                        <Input
                            label="Degree"
                            value={form.degree}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, degree: v }))
                            }
                        />
                        <Input
                            label="Institution"
                            value={form.institution}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, institution: v }))
                            }
                        />
                        <Input
                            label="Description"
                            value={form.description}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, description: v }))
                            }
                            rows={3}
                        />
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 10,
                                marginTop: 8,
                            }}
                        >
                            <Btn
                                onClick={() => setModal(false)}
                                variant="ghost"
                            >
                                Cancel
                            </Btn>
                            <Btn onClick={save} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Btn>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── TECH STACK TAB ─────────────────────────────────────────
function TechStackTab() {
    const [rows, setRows] = useState<any[]>([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState({
        name: '',
        icon_url: '',
        underline: '#ff5e1a',
        row: 'top',
    });
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        const { data } = await supabase
            .from('tech_stack')
            .select('*')
            .order('row')
            .order('sort_order');
        setRows(data ?? []);
    }, []);
    useEffect(() => {
        load();
    }, [load]);

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', icon_url: '', underline: '#ff5e1a', row: 'top' });
        setModal(true);
    };
    const openEdit = (r: any) => {
        setEditing(r);
        setForm({
            name: r.name,
            icon_url: r.icon_url,
            underline: r.underline,
            row: r.row,
        });
        setModal(true);
    };

    const save = async () => {
        setSaving(true);
        const payload = {
            name: form.name,
            icon_url: form.icon_url,
            underline: form.underline,
            row: form.row,
        };
        if (editing)
            await supabase
                .from('tech_stack')
                .update(payload)
                .eq('id', editing.id);
        else
            await supabase.from('tech_stack').insert({
                ...payload,
                sort_order: rows.length + 1,
                active: true,
            });
        setSaving(false);
        setModal(false);
        load();
    };

    const del = async (id: string) => {
        if (!confirm('Delete this tech?')) return;
        await supabase.from('tech_stack').delete().eq('id', id);
        load();
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }}
            >
                <span
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.3)',
                    }}
                >
                    {rows.length} technologies
                </span>
                <Btn onClick={openNew}>+ Add Tech</Btn>
            </div>
            {['top', 'bottom'].map((rowName) => (
                <div key={rowName} style={{ marginBottom: 24 }}>
                    <div
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 9,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,94,26,0.4)',
                            marginBottom: 10,
                        }}
                    >
                        Row: {rowName}
                    </div>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: 8,
                        }}
                    >
                        {rows
                            .filter((r) => r.row === rowName)
                            .map((r) => (
                                <div
                                    key={r.id}
                                    style={{
                                        padding: '12px 14px',
                                        background: 'rgba(245,240,232,0.02)',
                                        border: `1px solid ${r.active ? 'rgba(255,94,26,0.12)' : 'rgba(245,240,232,0.04)'}`,
                                        opacity: r.active ? 1 : 0.4,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <img
                                            src={r.icon_url}
                                            alt={r.name}
                                            width={24}
                                            height={24}
                                            style={{ objectFit: 'contain' }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 700,
                                                color: 'rgba(245,240,232,0.85)',
                                            }}
                                        >
                                            {r.name}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: 20,
                                            height: 2,
                                            borderRadius: 1,
                                            background: r.underline,
                                            marginBottom: 10,
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <Btn
                                            onClick={() => openEdit(r)}
                                            variant="ghost"
                                            small
                                        >
                                            Edit
                                        </Btn>
                                        <Btn
                                            onClick={() => del(r.id)}
                                            variant="danger"
                                            small
                                        >
                                            Del
                                        </Btn>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
            {modal && (
                <Modal
                    title={editing ? 'Edit Tech' : 'New Tech'}
                    onClose={() => setModal(false)}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14,
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 80px',
                                gap: 14,
                            }}
                        >
                            <Input
                                label="Name"
                                value={form.name}
                                onChange={(v) =>
                                    setForm((f) => ({ ...f, name: v }))
                                }
                                placeholder="React"
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 6,
                                }}
                            >
                                <label
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 9,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(245,240,232,0.3)',
                                    }}
                                >
                                    Row
                                </label>
                                <select
                                    value={form.row}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            row: e.target.value,
                                        }))
                                    }
                                    style={{
                                        padding: '10px 14px',
                                        background: 'rgba(245,240,232,0.04)',
                                        border: '1px solid rgba(255,94,26,0.15)',
                                        color: 'rgba(245,240,232,0.85)',
                                        fontFamily: 'monospace',
                                        fontSize: 13,
                                        outline: 'none',
                                    }}
                                >
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                            </div>
                        </div>
                        <Input
                            label="Icon URL (devicons CDN)"
                            value={form.icon_url}
                            onChange={(v) =>
                                setForm((f) => ({ ...f, icon_url: v }))
                            }
                            placeholder="https://cdn.jsdelivr.net/gh/devicons/..."
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 6,
                            }}
                        >
                            <label
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: 9,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(245,240,232,0.3)',
                                }}
                            >
                                Underline Color
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: 10,
                                    alignItems: 'center',
                                }}
                            >
                                <input
                                    type="color"
                                    value={form.underline}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            underline: e.target.value,
                                        }))
                                    }
                                    style={{
                                        width: 48,
                                        height: 38,
                                        padding: 2,
                                        background: 'none',
                                        border: '1px solid rgba(255,94,26,0.15)',
                                        cursor: 'pointer',
                                    }}
                                />
                                <input
                                    type="text"
                                    value={form.underline}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            underline: e.target.value,
                                        }))
                                    }
                                    style={{
                                        flex: 1,
                                        padding: '10px 14px',
                                        background: 'rgba(245,240,232,0.04)',
                                        border: '1px solid rgba(255,94,26,0.15)',
                                        color: 'rgba(245,240,232,0.85)',
                                        fontFamily: 'monospace',
                                        fontSize: 13,
                                        outline: 'none',
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 10,
                                marginTop: 8,
                            }}
                        >
                            <Btn
                                onClick={() => setModal(false)}
                                variant="ghost"
                            >
                                Cancel
                            </Btn>
                            <Btn onClick={save} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </Btn>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// ── ABOUT TAB ──────────────────────────────────────────────
function AboutTab() {
    const [data, setData] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        supabase
            .from('about')
            .select('*')
            .single()
            .then(({ data }) => setData(data));
    }, []);

    const save = async () => {
        setSaving(true);
        if (data?.id)
            await supabase.from('about').update(data).eq('id', data.id);
        else await supabase.from('about').insert(data);
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!data)
        return (
            <div
                style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: 'rgba(245,240,232,0.3)',
                }}
            >
                Loading...
            </div>
        );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                maxWidth: 640,
            }}
        >
            <Input
                label="Bio Line 1"
                value={data.bio_line1 ?? ''}
                onChange={(v) => setData((d: any) => ({ ...d, bio_line1: v }))}
                rows={3}
            />
            <Input
                label="Bio Line 2"
                value={data.bio_line2 ?? ''}
                onChange={(v) => setData((d: any) => ({ ...d, bio_line2: v }))}
                rows={3}
            />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: 14,
                }}
            >
                <Input
                    label="Years Exp"
                    value={data.stat_years ?? ''}
                    onChange={(v) =>
                        setData((d: any) => ({ ...d, stat_years: v }))
                    }
                    placeholder="3+"
                />
                <Input
                    label="Projects"
                    value={data.stat_projects ?? ''}
                    onChange={(v) =>
                        setData((d: any) => ({ ...d, stat_projects: v }))
                    }
                    placeholder="20+"
                />
                <Input
                    label="Clients"
                    value={data.stat_clients ?? ''}
                    onChange={(v) =>
                        setData((d: any) => ({ ...d, stat_clients: v }))
                    }
                    placeholder="10+"
                />
            </div>
            <Input
                label="GitHub URL"
                value={data.github_url ?? ''}
                onChange={(v) => setData((d: any) => ({ ...d, github_url: v }))}
                placeholder="https://github.com/..."
            />
            <Input
                label="LinkedIn URL"
                value={data.linkedin_url ?? ''}
                onChange={(v) =>
                    setData((d: any) => ({ ...d, linkedin_url: v }))
                }
                placeholder="https://linkedin.com/in/..."
            />
            <Input
                label="Email"
                value={data.email ?? ''}
                onChange={(v) => setData((d: any) => ({ ...d, email: v }))}
                placeholder="email@example.com"
            />
            <Input
                label="Resume URL"
                value={data.resume_url ?? ''}
                onChange={(v) => setData((d: any) => ({ ...d, resume_url: v }))}
                placeholder="/resume.pdf"
            />
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    marginTop: 8,
                }}
            >
                <Btn onClick={save} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Btn>
                {saved && (
                    <span
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 10,
                            color: '#4ade80',
                            letterSpacing: '0.15em',
                        }}
                    >
                        ✓ Saved
                    </span>
                )}
            </div>
        </div>
    );
}

// ── MESSAGES TAB ───────────────────────────────────────────
function MessagesTab() {
    const [rows, setRows] = useState<any[]>([]);
    const [open, setOpen] = useState<string | null>(null);

    const load = useCallback(async () => {
        const { data } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        setRows(data ?? []);
    }, []);
    useEffect(() => {
        load();
    }, [load]);

    const markRead = async (id: string) => {
        await supabase
            .from('contact_messages')
            .update({ read: true })
            .eq('id', id);
        load();
    };
    const del = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        await supabase.from('contact_messages').delete().eq('id', id);
        load();
    };

    const unread = rows.filter((r) => !r.read).length;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24,
                }}
            >
                <span
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(245,240,232,0.3)',
                    }}
                >
                    {rows.length} messages{' '}
                    {unread > 0 && (
                        <span style={{ color: '#ff5e1a' }}>
                            · {unread} unread
                        </span>
                    )}
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map((r) => (
                    <div
                        key={r.id}
                        style={{
                            padding: '16px 18px',
                            background: r.read
                                ? 'rgba(245,240,232,0.02)'
                                : 'rgba(255,94,26,0.04)',
                            border: `1px solid ${r.read ? 'rgba(255,94,26,0.06)' : 'rgba(255,94,26,0.2)'}`,
                            cursor: 'pointer',
                        }}
                        onClick={() => setOpen(open === r.id ? null : r.id)}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                }}
                            >
                                {!r.read && (
                                    <div
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            background: '#ff5e1a',
                                            flexShrink: 0,
                                        }}
                                    />
                                )}
                                <div>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: 'rgba(245,240,232,0.85)',
                                        }}
                                    >
                                        {r.name}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: 10,
                                            color: 'rgba(245,240,232,0.3)',
                                            marginLeft: 10,
                                        }}
                                    >
                                        {r.email}
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 9,
                                        color: 'rgba(245,240,232,0.2)',
                                    }}
                                >
                                    {new Date(
                                        r.created_at,
                                    ).toLocaleDateString()}
                                </span>
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ display: 'flex', gap: 6 }}
                                >
                                    {!r.read && (
                                        <Btn
                                            onClick={() => markRead(r.id)}
                                            variant="ghost"
                                            small
                                        >
                                            Mark read
                                        </Btn>
                                    )}
                                    <Btn
                                        onClick={() => del(r.id)}
                                        variant="danger"
                                        small
                                    >
                                        Del
                                    </Btn>
                                </div>
                            </div>
                        </div>
                        {open === r.id && (
                            <div
                                style={{
                                    marginTop: 12,
                                    paddingTop: 12,
                                    borderTop: '1px solid rgba(255,94,26,0.1)',
                                }}
                            >
                                {r.service && (
                                    <div
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: 10,
                                            color: 'rgba(255,94,26,0.5)',
                                            marginBottom: 8,
                                        }}
                                    >
                                        Service: {r.service}
                                    </div>
                                )}
                                <p
                                    style={{
                                        fontSize: 13,
                                        color: 'rgba(245,240,232,0.5)',
                                        lineHeight: 1.75,
                                        margin: 0,
                                    }}
                                >
                                    {r.message}
                                </p>
                                <a
                                    href={`mailto:${r.email}`}
                                    style={{
                                        display: 'inline-block',
                                        marginTop: 12,
                                        fontFamily: 'monospace',
                                        fontSize: 10,
                                        letterSpacing: '0.15em',
                                        textTransform: 'uppercase',
                                        color: '#ff5e1a',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Reply via Email →
                                </a>
                            </div>
                        )}
                    </div>
                ))}
                {rows.length === 0 && (
                    <div
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 11,
                            color: 'rgba(245,240,232,0.2)',
                            padding: 20,
                            textAlign: 'center',
                        }}
                    >
                        No messages yet.
                    </div>
                )}
            </div>
        </div>
    );
}

// ── QUOTE TAB ──────────────────────────────────────────────
function QuoteTab() {
    const [data, setData] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        supabase
            .from('quote')
            .select('*')
            .single()
            .then(({ data }) => setData(data ?? { text: '', author: '' }));
    }, []);

    const save = async () => {
        setSaving(true);
        if (data?.id)
            await supabase
                .from('quote')
                .update({
                    text: data.text,
                    author: data.author,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', data.id);
        else
            await supabase
                .from('quote')
                .insert({ text: data.text, author: data.author });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (!data)
        return (
            <div
                style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    color: 'rgba(245,240,232,0.3)',
                }}
            >
                Loading...
            </div>
        );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                maxWidth: 640,
            }}
        >
            {/* Preview */}
            <div
                style={{
                    padding: '20px 24px',
                    background: 'rgba(255,94,26,0.04)',
                    border: '1px solid rgba(255,94,26,0.12)',
                    marginBottom: 8,
                }}
            >
                <div
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 9,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,94,26,0.4)',
                        marginBottom: 12,
                    }}
                >
                    Preview
                </div>
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color: 'rgba(255,94,26,0.15)',
                        lineHeight: 0.8,
                        marginBottom: 8,
                    }}
                >
                    "
                </div>
                <p
                    style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'rgba(245,240,232,0.7)',
                        lineHeight: 1.5,
                        marginBottom: 12,
                    }}
                >
                    {data.text || '...'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                        style={{
                            width: 32,
                            height: 1,
                            background: 'rgba(255,94,26,0.4)',
                        }}
                    />
                    <span
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 10,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,94,26,0.6)',
                        }}
                    >
                        {data.author || '...'}
                    </span>
                </div>
            </div>

            <Input
                label="Quote Text"
                value={data.text ?? ''}
                onChange={(v) => setData((d: any) => ({ ...d, text: v }))}
                rows={4}
                placeholder="Enter your quote here..."
            />
            <Input
                label="Author"
                value={data.author ?? ''}
                onChange={(v) => setData((d: any) => ({ ...d, author: v }))}
                placeholder="e.g. Warren Buffett"
            />

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    marginTop: 8,
                }}
            >
                <Btn onClick={save} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Quote'}
                </Btn>
                {saved && (
                    <span
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 10,
                            color: '#4ade80',
                            letterSpacing: '0.15em',
                        }}
                    >
                        ✓ Saved — site updates on next visit
                    </span>
                )}
            </div>
        </div>
    );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────
export default function Dashboard() {
    const [tab, setTab] = useState<Tab>('overview');
    const [user, setUser] = useState<any>(null);
    const [counts, setCounts] = useState({
        projects: 0,
        testimonials: 0,
        services: 0,
        messages: 0,
        unread: 0,
    });
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (!data.user) {
                router.push('/admin');
                return;
            }
            setUser(data.user);
        });
        // Load counts
        Promise.all([
            supabase
                .from('projects')
                .select('id', { count: 'exact', head: true }),
            supabase
                .from('testimonials')
                .select('id', { count: 'exact', head: true }),
            supabase
                .from('services')
                .select('id', { count: 'exact', head: true }),
            supabase
                .from('contact_messages')
                .select('id', { count: 'exact', head: true }),
            supabase
                .from('contact_messages')
                .select('id', { count: 'exact', head: true })
                .eq('read', false),
        ]).then(([p, t, s, m, u]) => {
            setCounts({
                projects: p.count ?? 0,
                testimonials: t.count ?? 0,
                services: s.count ?? 0,
                messages: m.count ?? 0,
                unread: u.count ?? 0,
            });
        });
    }, [router]);

    const logout = async () => {
        await supabase.auth.signOut();
        router.push('/admin');
    };

    const tabs: { id: Tab; label: string; count?: number }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'projects', label: 'Projects', count: counts.projects },
        {
            id: 'testimonials',
            label: 'Testimonials',
            count: counts.testimonials,
        },
        { id: 'services', label: 'Services', count: counts.services },
        { id: 'education', label: 'Education' },
        { id: 'techstack', label: 'Tech Stack' },
        { id: 'about', label: 'About' },
        { id: 'quote', label: 'Quote' },
        {
            id: 'messages',
            label: 'Messages',
            count: counts.unread > 0 ? counts.unread : undefined,
        },
    ];

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#0a0a08',
                color: 'rgba(245,240,232,0.85)',
                fontFamily: "'Syne', sans-serif",
            }}
        >
            {/* Top nav */}
            <div
                style={{
                    borderBottom: '1px solid rgba(255,94,26,0.1)',
                    padding: '16px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    background: 'rgba(10,10,8,0.95)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 100,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                        src="/favicon.svg"
                        alt="Sadeepa"
                        width={28}
                        height={28}
                    />
                    <div>
                        <div
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 12,
                                fontWeight: 800,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                            }}
                        >
                            SADEEPA<span style={{ color: '#ff5e1a' }}>.</span>{' '}
                            Admin
                        </div>
                        {user && (
                            <div
                                style={{
                                    fontFamily: 'monospace',
                                    fontSize: 9,
                                    letterSpacing: '0.15em',
                                    color: 'rgba(245,240,232,0.25)',
                                    marginTop: 1,
                                }}
                            >
                                {user.email}
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontFamily: 'monospace',
                            fontSize: 10,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'rgba(245,240,232,0.3)',
                            textDecoration: 'none',
                        }}
                    >
                        View Site ↗
                    </a>
                    <Btn onClick={logout} variant="ghost" small>
                        Sign Out
                    </Btn>
                </div>
            </div>

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 57px)' }}>
                {/* Sidebar */}
                <div
                    style={{
                        width: 220,
                        borderRight: '1px solid rgba(255,94,26,0.08)',
                        padding: '24px 0',
                        flexShrink: 0,
                        position: 'sticky',
                        top: 57,
                        height: 'calc(100vh - 57px)',
                        overflowY: 'auto',
                    }}
                >
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            style={{
                                width: '100%',
                                padding: '11px 24px',
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontFamily: 'monospace',
                                fontSize: 10,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                color:
                                    tab === t.id
                                        ? '#ff5e1a'
                                        : 'rgba(245,240,232,0.3)',
                                borderLeft:
                                    tab === t.id
                                        ? '2px solid #ff5e1a'
                                        : '2px solid transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textAlign: 'left',
                                background:
                                    tab === t.id
                                        ? 'rgba(255,94,26,0.05)'
                                        : ('none' as any),
                            }}
                        >
                            {t.label}
                            {t.count !== undefined && t.count > 0 && (
                                <span
                                    style={{
                                        background: 'rgba(255,94,26,0.2)',
                                        color: '#ff5e1a',
                                        fontSize: 9,
                                        fontWeight: 700,
                                        padding: '2px 7px',
                                        borderRadius: 10,
                                    }}
                                >
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Main content */}
                <div
                    style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}
                >
                    {/* Tab header */}
                    <div
                        style={{
                            marginBottom: 32,
                            borderBottom: '1px solid rgba(255,94,26,0.08)',
                            paddingBottom: 20,
                        }}
                    >
                        <div
                            style={{
                                fontFamily: 'monospace',
                                fontSize: 9,
                                letterSpacing: '0.3em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,94,26,0.5)',
                                marginBottom: 6,
                            }}
                        >
                            {tab === 'overview' ? 'Dashboard' : 'Manage'}
                        </div>
                        <h1
                            style={{
                                fontSize: 28,
                                fontWeight: 900,
                                letterSpacing: '-0.025em',
                                color: 'rgba(245,240,232,0.92)',
                                margin: 0,
                                textTransform: 'capitalize',
                            }}
                        >
                            {tab}
                        </h1>
                    </div>

                    {/* Overview */}
                    {tab === 'overview' && (
                        <div>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: 16,
                                    marginBottom: 40,
                                }}
                            >
                                <StatCard
                                    label="Projects"
                                    value={counts.projects}
                                    sub="In database"
                                />
                                <StatCard
                                    label="Testimonials"
                                    value={counts.testimonials}
                                    sub="In database"
                                />
                                <StatCard
                                    label="Services"
                                    value={counts.services}
                                    sub="Active"
                                />
                                <StatCard
                                    label="Messages"
                                    value={counts.messages}
                                    sub={
                                        counts.unread > 0
                                            ? `${counts.unread} unread`
                                            : 'All read'
                                    }
                                />
                            </div>
                            <div
                                style={{
                                    padding: '20px 24px',
                                    background: 'rgba(255,94,26,0.04)',
                                    border: '1px solid rgba(255,94,26,0.15)',
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: 9,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,94,26,0.6)',
                                        marginBottom: 8,
                                    }}
                                >
                                    Quick tips
                                </div>
                                <ul
                                    style={{
                                        margin: 0,
                                        padding: '0 0 0 16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 6,
                                    }}
                                >
                                    {[
                                        'Edit bio, stats & links → About tab',
                                        'Add/remove projects → Projects tab',
                                        'Show/hide services with the toggle → Services tab',
                                        'Unread contact messages appear highlighted → Messages tab',
                                        'Tech stack cards update live on site → Tech Stack tab',
                                        'Change the quote & author → Quote tab',
                                    ].map((tip) => (
                                        <li
                                            key={tip}
                                            style={{
                                                fontFamily: 'monospace',
                                                fontSize: 11,
                                                color: 'rgba(245,240,232,0.35)',
                                            }}
                                        >
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {tab === 'projects' && <ProjectsTab />}
                    {tab === 'testimonials' && <TestimonialsTab />}
                    {tab === 'services' && <ServicesTab />}
                    {tab === 'education' && <EducationTab />}
                    {tab === 'techstack' && <TechStackTab />}
                    {tab === 'about' && <AboutTab />}
                    {tab === 'quote' && <QuoteTab />}
                    {tab === 'messages' && <MessagesTab />}
                </div>
            </div>
        </div>
    );
}
