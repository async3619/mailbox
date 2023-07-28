import merge from "deepmerge";
import { IncomingHttpHeaders } from "http";
import fetch from "isomorphic-unfetch";
import isEqual from "lodash/isEqual";
import apolloLogger from "apollo-link-logger";

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = String(0);

const createApolloClient = (uri: string | null, headers: IncomingHttpHeaders | null = null) => {
    const enhancedFetch = (url: RequestInfo, init?: RequestInit) => {
        return fetch(url, {
            ...init,
            headers: {
                ...init?.headers,
                "Access-Control-Allow-Origin": "*",
                Cookie: headers?.cookie ?? "",
            },
        }).then(response => response);
    };

    const createHttpLink = () => {
        return new HttpLink({
            uri: uri ?? "",
            fetchOptions: { mode: "cors" },
            fetch: (url: RequestInfo, init?: RequestInit) => {
                if (!uri) {
                    throw new Error("api url is required");
                }

                return enhancedFetch(url, init);
            },
        });
    };

    const fetchLink = createHttpLink();
    const needLogging = process.env.NODE_ENV === "development" && typeof window !== "undefined";

    const links = [
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.forEach(({ message, locations, path }) =>
                    console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
                );
            if (networkError) console.error(`[Network error]: ${networkError}. Backend is unreachable. Is it running?`);
        }),
        // this uses apollo-link-http under the hood, so all the options here come from that package
        fetchLink,
    ];

    if (needLogging) {
        links.unshift(apolloLogger);
    }

    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: ApolloLink.from(links),
        cache: new InMemoryCache({
            typePolicies: {},
        }),
    });
};

type InitialState = NormalizedCacheObject | undefined;

interface IInitializeApollo {
    headers?: IncomingHttpHeaders | null;
    initialState?: InitialState | null;
    url?: string | null;
}

export const createClient = (options?: IInitializeApollo) => {
    const { headers = null, initialState = null, url = null } = options || {};
    const localApolloClient = apolloClient ?? createApolloClient(url, headers);
    if (initialState) {
        const existingCache = localApolloClient.extract();
        const data = merge(initialState, existingCache, {
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
            ],
        });

        localApolloClient.cache.restore(data);
    }

    if (typeof window === "undefined") return localApolloClient;
    if (!apolloClient) apolloClient = localApolloClient;

    return localApolloClient;
};
