import { createClient } from '@supabase/supabase-js';
import PageClient from './PageClient';

// Force dynamic rendering so data is always fresh from Supabase
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const [
            projectsRes,
            testimonialsRes,
            aboutRes,
            servicesRes,
            educationRes,
            techRes,
            quoteRes,
        ] = await Promise.all([
            supabase
                .from('projects')
                .select('*')
                .order('sort_order', { ascending: true }),
            supabase
                .from('testimonials')
                .select('*')
                .order('sort_order', { ascending: true }),
            supabase.from('about').select('*').limit(1).single(),
            supabase
                .from('services')
                .select('*')
                .eq('active', true)
                .order('sort_order', { ascending: true }),
            supabase
                .from('education')
                .select('*')
                .order('sort_order', { ascending: true }),
            supabase
                .from('tech_stack')
                .select('*')
                .eq('active', true)
                .order('sort_order', { ascending: true }),
            supabase.from('quote').select('*').limit(1).single(),
        ]);

        // Log errors in dev so we can see what's failing
        if (process.env.NODE_ENV === 'development') {
            if (projectsRes.error)
                console.error('projects error:', projectsRes.error.message);
            if (testimonialsRes.error)
                console.error(
                    'testimonials error:',
                    testimonialsRes.error.message,
                );
            if (aboutRes.error)
                console.error('about error:', aboutRes.error.message);
            if (servicesRes.error)
                console.error('services error:', servicesRes.error.message);
            if (educationRes.error)
                console.error('education error:', educationRes.error.message);
            if (techRes.error)
                console.error('tech_stack error:', techRes.error.message);
        }

        return {
            projects: projectsRes.data ?? [],
            testimonials: testimonialsRes.data ?? [],
            about: aboutRes.data ?? null,
            services: servicesRes.data ?? [],
            education: educationRes.data ?? [],
            techStack: techRes.data ?? [],
            quote: quoteRes.data ?? null,
        };
    } catch (e) {
        console.error('Supabase fetch failed:', e);
        return {
            projects: [],
            testimonials: [],
            about: null,
            services: [],
            education: [],
            techStack: [],
            quote: null,
        };
    }
}

export default async function Home() {
    const data = await getData();
    return <PageClient {...data} />;
}
