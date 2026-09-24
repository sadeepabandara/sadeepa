import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectDetailPage from './ProjectDetailPage';

export const dynamic = 'force-dynamic';

async function getProject(id: string) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) return null;
        return data;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const project = await getProject(params.id);
    if (!project) return { title: 'Project Not Found' };
    return {
        title: project.title,
        description: project.overview ?? `${project.title} — a project by Sadeepa Bandara`,
    };
}

export default async function Page({ params }: { params: { id: string } }) {
    const project = await getProject(params.id);
    if (!project) notFound();
    return <ProjectDetailPage project={project} />;
}
