/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: ["ui"],

    compiler: {
        emotion: true,
    },
};

module.exports = nextConfig;
