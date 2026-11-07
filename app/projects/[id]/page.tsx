import { createClient } from '@supabase/supabase-js';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import ProjectDetailPage from './ProjectDetailPage';
import {
    fallbackProjects,
    projectSlug,
    withProjectDefaults,
} from '@/lib/projectContent';

export const dynamic = 'force-dynamic';

// The [id] segment holds a slug (e.g. "melbourne-open-playground").
// Old links using the database id (uuid) or the fallback ids still work and
// are redirected to the slug URL.
async function getProject(param: string) {
    let list: any[] = [];
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { data } = await supabase
            .from('projects')
            .select('*')
            .order('sort_order', { ascending: true });
        list = data ?? [];
    } catch {
        list = [];
    }
    if (list.length === 0) list = fallbackProjects;

    const found =
        list.find((p) => projectSlug(p) === param) ??
        list.find((p) => String(p.id) === param);
    return found ? withProjectDefaults(found) : null;
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
    const slug = projectSlug(project);
    if (params.id !== slug) redirect(`/projects/${slug}`);
    return <ProjectDetailPage project={project} />;
}
