// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    transpilePackages: ["ui", "fetcher", "content-parser"],
    output: "standalone",

    i18n,

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
