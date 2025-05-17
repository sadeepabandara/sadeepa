/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    output: "export",
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
