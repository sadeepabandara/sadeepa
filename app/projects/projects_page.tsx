import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';
import AllProjectsClient from './AllProjectsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'All Projects',
    description: 'A curated collection of projects by Sadeepa Bandara — spanning web development, design, fintech, and AI.',
};

async function getAllProjects() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('sort_order', { ascending: true });
        return data ?? [];
    } catch {
        return [];
    }
}

export default async function ProjectsPage() {
    const projects = await getAllProjects();
    return <AllProjectsClient projects={projects} />;
}
