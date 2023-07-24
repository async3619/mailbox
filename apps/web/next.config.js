/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: ["ui", "fetcher", "content-parser"],
    output: "standalone",

    serverRuntimeConfig: {
        apiUrl: process.env.SERV_GRAPHQL_URI,
    },
    publicRuntimeConfig: {
        apiUrl: process.env.GRAPHQL_URI,
    },

    compiler: {
        emotion: true,
    },
};

module.exports = nextConfig;
