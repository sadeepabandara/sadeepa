'use client';
import { useState, useCallback } from 'react';
import Cursor from '@/components/Cursor';
import SmoothScroll from '@/components/SmoothScroll';
import CursorTrail from '@/components/CursorTrail';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import Quote from '@/components/Quote';
import About from '@/components/About';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import TechStack from '@/components/TechStack';
import Education from '@/components/Education';
import FlappyGame from '@/components/FlappyGame';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import type { Project } from '@/components/Projects';
import type { Testimonial } from '@/components/Testimonials';

interface AboutData {
    bio_line1: string;
    bio_line2?: string;
    stat_years: string;
    stat_projects: string;
    stat_clients: string;
    github_url?: string;
    linkedin_url?: string;
    email?: string;
    resume_url?: string;
}
interface ServiceData {
    number: string;
    icon: string;
    title: string;
    description: string;
    tags: string[];
}
interface EducationData {
    period: string;
    degree: string;
    institution: string;
    description: string;
    align: string;
}
interface TechData {
    name: string;
    icon_url: string;
    underline: string;
    row: string;
    sort_order: number;
}

interface QuoteData {
    text: string;
    author: string;
}

interface PageClientProps {
    projects: Project[];
    testimonials: Testimonial[];
    about: AboutData | null;
    services: ServiceData[];
    education: EducationData[];
    techStack: TechData[];
    quote: QuoteData | null;
}

export default function PageClient({
    projects,
    testimonials,
    about,
    services,
    education,
    techStack,
    quote,
}: PageClientProps) {
    const [loaded, setLoaded] = useState(false);
    const onLoaderDone = useCallback(() => setLoaded(true), []);

    return (
        <>
            <SmoothScroll />
            <CursorTrail />
            <Cursor />
            {!loaded && <Loader onComplete={onLoaderDone} />}
            <Nav visible={loaded} />
            <Hero animate={loaded} />
            <Ticker />
            <Quote data={quote} />
            <About data={about} />
            <Services data={services.length ? services : undefined} />
            <Projects projects={projects.length ? projects : undefined} />
            <TechStack data={techStack.length ? techStack : undefined} />
            <Education data={education.length ? education : undefined} />
            <FlappyGame />
            <Testimonials
                testimonials={testimonials.length ? testimonials : undefined}
            />
            <Contact />
        </>
    );
}
