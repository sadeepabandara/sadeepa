import type { Metadata } from 'next';
import { Syne, Syne_Mono } from 'next/font/google';
import './globals.css';
import JsonLd from '@/components/JsonLd';

const syne = Syne({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-syne',
    display: 'swap',
});

const syneMono = Syne_Mono({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-syne-mono',
    display: 'swap',
});

const BASE_URL = 'https://sadeepa.me';

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: 'Sadeepa Bandara — Software Developer & Designer',
        template: '%s | Sadeepa Bandara',
    },
    description:
        'Sadeepa Bandara is a Software Developer & Designer from Sri Lanka based in Australia. Specialising in React, Next.js, UI/UX design, web development and creative digital experiences.',
    keywords: [
        'Sadeepa Bandara',
        'Sadeepa',
        'Software Developer Sri Lanka',
        'Web Developer Australia',
        'UI UX Designer',
        'React Developer',
        'Next.js Developer',
        'Portfolio',
        'Creative Developer',
        'Full Stack Developer Sri Lanka',
        'Web Designer Australia',
        'sadeepa.me',
    ],
    authors: [{ name: 'Sadeepa Bandara', url: BASE_URL }],
    creator: 'Sadeepa Bandara',
    publisher: 'Sadeepa Bandara',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: BASE_URL,
    },
    openGraph: {
        type: 'website',
        url: BASE_URL,
        siteName: 'Sadeepa Bandara',
        title: 'Sadeepa Bandara — Software Developer & Designer',
        description:
            'Software Developer & Designer from Sri Lanka based in Australia. Building digital experiences with React, Next.js and creative design.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Sadeepa Bandara — Software Developer & Designer',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sadeepa Bandara — Software Developer & Designer',
        description:
            'Software Developer & Designer from Sri Lanka based in Australia.',
        images: ['/og-image.jpg'],
        creator: '@sadeepabandara',
    },
    icons: {
        icon: '/favicon.svg',
        shortcut: '/favicon.svg',
        apple: '/favicon.svg',
    },
    verification: {
        google: 'google3ab8bff6e56ecb64.html',
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${syne.variable} ${syneMono.variable}`}>
            <body className="bg-bg text-fg font-syne antialiased overflow-x-hidden cursor-none">
                <JsonLd />
                {children}
            </body>
        </html>
    );
}
