export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            contact_messages: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    email: string;
                    service: string | null;
                    message: string;
                    read: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    email: string;
                    service?: string | null;
                    message: string;
                    read?: boolean;
                };
                Update: Partial<
                    Database['public']['Tables']['contact_messages']['Insert']
                >;
            };
            projects: {
                Row: {
                    id: string;
                    created_at: string;
                    number: string;
                    title: string;
                    tags: string[];
                    year: string;
                    url: string | null;
                    image: string | null;
                    featured: boolean;
                    sort_order: number;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    number: string;
                    title: string;
                    tags: string[];
                    year: string;
                    url?: string | null;
                    image?: string | null;
                    featured?: boolean;
                    sort_order?: number;
                };
                Update: Partial<
                    Database['public']['Tables']['projects']['Insert']
                >;
            };
            testimonials: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    role: string;
                    company: string;
                    text: string;
                    initials: string;
                    featured: boolean;
                    sort_order: number;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    name: string;
                    role: string;
                    company: string;
                    text: string;
                    initials: string;
                    featured?: boolean;
                    sort_order?: number;
                };
                Update: Partial<
                    Database['public']['Tables']['testimonials']['Insert']
                >;
            };
            about: {
                Row: {
                    id: string;
                    bio_line1: string;
                    bio_line2: string | null;
                    stat_years: string;
                    stat_projects: string;
                    stat_clients: string;
                    github_url: string | null;
                    linkedin_url: string | null;
                    email: string | null;
                    resume_url: string | null;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    bio_line1: string;
                    bio_line2?: string | null;
                    stat_years: string;
                    stat_projects: string;
                    stat_clients: string;
                    github_url?: string | null;
                    linkedin_url?: string | null;
                    email?: string | null;
                    resume_url?: string | null;
                    updated_at?: string;
                };
                Update: Partial<
                    Database['public']['Tables']['about']['Insert']
                >;
            };
            services: {
                Row: {
                    id: string;
                    number: string;
                    icon: string;
                    title: string;
                    description: string;
                    tags: string[];
                    sort_order: number;
                    active: boolean;
                };
                Insert: {
                    id?: string;
                    number: string;
                    icon: string;
                    title: string;
                    description: string;
                    tags: string[];
                    sort_order?: number;
                    active?: boolean;
                };
                Update: Partial<
                    Database['public']['Tables']['services']['Insert']
                >;
            };
            education: {
                Row: {
                    id: string;
                    period: string;
                    degree: string;
                    institution: string;
                    description: string;
                    align: string;
                    sort_order: number;
                };
                Insert: {
                    id?: string;
                    period: string;
                    degree: string;
                    institution: string;
                    description: string;
                    align?: string;
                    sort_order?: number;
                };
                Update: Partial<
                    Database['public']['Tables']['education']['Insert']
                >;
            };
            tech_stack: {
                Row: {
                    id: string;
                    name: string;
                    icon_url: string;
                    underline: string;
                    row: string;
                    sort_order: number;
                    active: boolean;
                };
                Insert: {
                    id?: string;
                    name: string;
                    icon_url: string;
                    underline: string;
                    row?: string;
                    sort_order?: number;
                    active?: boolean;
                };
                Update: Partial<
                    Database['public']['Tables']['tech_stack']['Insert']
                >;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}
