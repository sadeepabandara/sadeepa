export default function JsonLd() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Sadeepa Bandara',
        url: 'https://sadeepa.me',
        image: 'https://sadeepa.me/hero.png',
        sameAs: [
            'https://github.com/sadeepabandara',
            'https://linkedin.com/in/sadeepa-bandara',
        ],
        jobTitle: 'Software Developer & Designer',
        description:
            'Software Developer & Designer from Sri Lanka based in Australia. Specialising in React, Next.js, UI/UX design and web development.',
        knowsAbout: [
            'Web Development',
            'UI/UX Design',
            'React',
            'Next.js',
            'TypeScript',
            'Software Development',
        ],
        nationality: 'Sri Lankan',
        alumniOf: [
            {
                '@type': 'CollegeOrUniversity',
                name: 'Coventry University',
                url: 'https://coventry.ac.uk',
            },
            {
                '@type': 'CollegeOrUniversity',
                name: 'Deakin University',
                url: 'https://deakin.edu.au',
            },
        ],
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'AU',
        },
        email: 'sadeepadexter@gmail.com',
        worksFor: {
            '@type': 'Organization',
            name: 'Freelance',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
