import getConfig from "next/config";

type Configuration = {
    [key in "serverRuntimeConfig" | "publicRuntimeConfig"]?: { apiUrl?: string };
};

export function getApiUrl() {
    const { serverRuntimeConfig, publicRuntimeConfig }: Configuration = getConfig();

    return {
        server: process.env.SERV_GRAPHQL_URI ?? serverRuntimeConfig?.apiUrl ?? null,
        client: process.env.GRAPHQL_URI ?? publicRuntimeConfig?.apiUrl ?? null,
    };
}
