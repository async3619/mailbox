/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ["ui"],

    compiler: {
        emotion: true,
    },
};

module.exports = nextConfig;
