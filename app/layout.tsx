import type { Metadata } from 'next';
import { Syne, Syne_Mono } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
    icons: {
        icon: '/favicon.svg',
    },
    title: 'Sadeepa — Designer & Developer',
    description:
        'Creative designer and developer crafting digital experiences at the intersection of art and engineering.',
    openGraph: {
        title: 'Sadeepa Bandara — Designer & Developer',
        description:
            'Crafting digital experiences that live between art and engineering.',
        type: 'website',
        url: 'https://sadeepa.me',
        siteName: 'Sadeepa Bandara',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sadeepa Bandara — Designer & Developer',
        description:
            'Crafting digital experiences that live between art and engineering.',
    },
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${syne.variable} ${syneMono.variable}`}>
            <body className="bg-bg text-fg font-syne antialiased overflow-x-hidden cursor-none">
                {children}
            </body>
        </html>
    );
}
