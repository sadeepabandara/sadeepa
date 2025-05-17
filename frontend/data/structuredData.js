const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Sadeepa Bandara",
    url: "https://szdeepa.com/about",
    sameAs: [
        "https://www.linkedin.com/in/szdeepa/",
        "https://github.com/szdeepa",
    ],
    educationalCredentialAwarded: [
        {
            "@type": "EducationalOccupationalCredential",
            name: "MSc in IT Management",
            educationalLevel: "Master's degree",
            credentialCategory: "degree",
            recognizedBy: {
                "@type": "EducationalOrganization",
                name: "Deakin University",
            },
            startDate: "2024",
            // omit endDate if ongoing
        },
        {
            "@type": "EducationalOccupationalCredential",
            name: "BSc (Hons) in Computing",
            educationalLevel: "Bachelor's degree",
            credentialCategory: "degree",
            recognizedBy: {
                "@type": "EducationalOrganization",
                name: "Coventry University",
            },
            startDate: "2021",
            endDate: "2024",
        },
        {
            "@type": "EducationalOccupationalCredential",
            name: "The Complete JavaScript Course 2022: From Zero to Expert!",
            credentialCategory: "certification",
            startDate: "2022",
        },
        {
            "@type": "EducationalOccupationalCredential",
            name: "Modern HTML & CSS From The Beginning",
            credentialCategory: "certification",
            startDate: "2021",
        },
    ],
};

export default structuredData;
