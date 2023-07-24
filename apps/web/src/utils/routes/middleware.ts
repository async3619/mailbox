import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

import { createClient } from "@apollo/createClient";

import { getApiUrl } from "@utils/getApiUrl";
import { PageProps } from "@utils/routes/types";

interface RouteMiddlewareClientOptions {
    client: ReturnType<typeof createClient>;
}

interface RouteMiddlewareOptions {
    title?: string;
}

export type RouteMiddlewareClient<
    T,
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData,
> = (
    context: GetServerSidePropsContext<Params, Preview>,
    options: RouteMiddlewareClientOptions,
) => Promise<GetServerSidePropsResult<T>>;

export function installRouteMiddleware<T extends PageProps>(options: RouteMiddlewareOptions = {}) {
    const { title } = options;

    return (origin: RouteMiddlewareClient<Omit<T, "title" | "apiUrl"> & { title?: string }>): GetServerSideProps<T> => {
        return async context => {
            const apiUrl = getApiUrl();
            if (!apiUrl) throw new Error("No API URL found");

            const apolloClient = createClient({ headers: context.req.headers, url: apiUrl.server });
            const data = await origin(context, { client: apolloClient });

            if ("props" in data) {
                const props = await data.props;

                return {
                    props: {
                        ...data.props,
                        title: title ?? props.title ?? null,
                        apiUrl: apiUrl.client ?? "",
                    } as T,
                };
            }

            return data;
        };
    };
}
