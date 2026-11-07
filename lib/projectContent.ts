// Single source of truth for project detail content + cover images.
// Anything stored in Supabase wins; these values fill in whatever is missing,
// so the hover popup, cards and detail pages are never empty.

export interface Project {
    id: string;
    number: string;
    title: string;
    tags: string[];
    year: string;
    url: string | null;
    image?: string | null;
    category?: string | null;
    overview?: string | null;
    challenge?: string | null;
    solution?: string | null;
    role?: string | null;
    client?: string | null;
    github_url?: string | null;
    images?: string[] | null;
}

type Content = Omit<Project, 'id' | 'number' | 'title' | 'tags' | 'year'> & {
    match: string[]; // lowercase fragments matched against the project title
};

const content: Content[] = [
    {
        match: ['sadeepa portfolio', 'portfolio'],
        image: '/projects/sadeepa-portfolio.jpg',
        category: 'Brand Identity / Web Development',
        overview:
            'A fully custom personal portfolio built from the ground up to reflect my approach to development: obsessive attention to detail, clean architecture, and experiences that feel alive. It features scroll-driven animations, a custom mask cursor effect, an interactive terminal, and a Supabase-powered CMS so every section can be edited without touching code.',
        challenge:
            'Balancing visual richness with performance. Every animation needed to feel premium without sacrificing load time or accessibility.',
        solution:
            'Built on Next.js and TypeScript with GSAP ScrollTrigger and Framer Motion handling motion. Animations are scoped and cleaned up per component, content lives in Supabase tables managed through a custom admin dashboard, and Tailwind keeps the styling consistent across every page.',
        role: 'Designer & Developer',
        client: 'Personal',
        url: 'https://sadeepa.me',
    },
    {
        match: ['spendwix'],
        image: '/projects/spendwix.jpg',
        category: 'FinTech / SaaS',
        overview:
            'A personal finance dashboard that lets users track spending, set budgets, and visualise their money habits over time. Inspired by a spreadsheet budgeting template, it adds a Free and Pro tier with multi-currency support (USD, AUD, LKR, GBP), Stripe-powered subscriptions, advanced reporting, and CSV exports.',
        challenge:
            'Designing a financial product that felt approachable rather than intimidating, turning raw numbers into clear visual stories.',
        solution:
            'A Next.js 14 App Router app backed by Supabase, with Zustand for client state and Recharts for the charts. Framer Motion adds gentle transitions, and Stripe handles the Pro subscription so advanced features unlock cleanly.',
        role: 'Full-Stack Developer',
        client: 'Open Source',
    },
    {
        match: ['frames'],
        image: '/projects/frames.jpg',
        category: 'Entertainment / Streaming',
        overview:
            'A Netflix-inspired streaming discovery platform powered by the TMDB API. It features real-time search, personalised watchlists, and a clean cinema-dark UI. Authentication is handled by Clerk, with MongoDB storing user data and Zustand managing client state.',
        challenge:
            'Building a fast, fluid browsing experience across thousands of titles without sacrificing perceived performance, while keeping video playback reliable across browsers.',
        solution:
            'TanStack Query caches TMDB responses so browsing feels instant, and Zustand keeps UI state light. Player overlays are rendered through React Portals so the browser keeps the user gesture context needed for video autoplay, and Clerk is configured for clean sign-in and sign-out flows.',
        role: 'Full-Stack Developer',
        client: 'Personal',
        url: 'https://watchframes.vercel.app',
        github_url: 'https://github.com/sadeepabandara/frames',
    },
    {
        match: ['melbourne open playground', 'open playground'],
        image: '/projects/melbourne-open-playground.jpg',
        category: 'Community / Social',
        overview:
            'A platform for Melbourne locals to discover and share open playgrounds, parks, and recreational spaces. Features include user-generated listings, reviews, and map integration.',
        challenge:
            'Handling geospatial data efficiently and building a trustworthy moderation system for community-submitted content.',
        solution:
            'A Next.js and TypeScript application on PostgreSQL, with JWT-based authentication and Bcrypt password hashing to keep accounts secure. Listings and reviews are tied to verified users so community content stays accountable.',
        role: 'Full-Stack Developer',
        client: 'Open Source',
    },
    {
        match: ['zippy'],
        image: '/projects/zippy-delivery.jpg',
        category: 'Logistics / E-Commerce',
        overview:
            'A delivery management platform built as a university team project. It includes driver dispatch, real-time order tracking, and a customer-facing storefront. Delivery was managed through Agile sprints using Jira.',
        challenge:
            'Coordinating a multi-person team on a tight deadline while maintaining code quality and consistent design across the product.',
        solution:
            'A React and Node.js stack styled with Tailwind CSS. Work was split into Agile sprints tracked in Jira, with Git branching and code review keeping the codebase consistent while the team shipped features in parallel.',
        role: 'Lead Developer',
        client: 'University Project',
    },
];

const clean = (v: unknown) => (typeof v === 'string' && v.trim() ? v : null);

export function findContent(title: string) {
    const t = title.toLowerCase();
    return content.find((c) => c.match.some((m) => t.includes(m)));
}

/** Fill any missing/empty fields on a project from the static content above. */
export function withProjectDefaults<T extends { title: string }>(p: T): T {
    const c = findContent(p.title);
    if (!c) return p;
    const out: any = { ...p };
    (
        [
            'image', 'category', 'overview', 'challenge', 'solution',
            'role', 'client', 'url', 'github_url',
        ] as const
    ).forEach((k) => {
        if (!clean(out[k])) out[k] = (c as any)[k] ?? null;
    });
    return out as T;
}

export const fallbackProjects: Project[] = [
    { id: '1', number: '001', title: 'Sadeepa Portfolio', tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Supabase'], year: '2026', url: null },
    { id: '2', number: '002', title: 'SpendWix Budget Tracker', tags: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Framer Motion', 'Recharts'], year: '2025', url: null },
    { id: '3', number: '003', title: 'Frames Streaming Platform', tags: ['Next.js', 'TypeScript', 'MongoDB', 'Clerk', 'Zustand', 'TMDB API'], year: '2026', url: null },
    { id: '4', number: '004', title: 'Melbourne Open Playground', tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'JWT', 'Bcrypt'], year: '2026', url: null },
    { id: '5', number: '005', title: 'Zippy Delivery Service', tags: ['React', 'Node.js', 'Tailwind CSS', 'Jira', 'Git'], year: '2023', url: null },
].map(withProjectDefaults);
