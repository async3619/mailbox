import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";

import { PageProps } from "@utils/routes/types";

interface RouteMiddlewareClientOptions {}

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

    return (origin?: RouteMiddlewareClient<Omit<T, "title"> & { title?: string }>): GetServerSideProps<T> => {
        return async context => {
            const data = (await origin?.(context, {})) ?? { props: { title: null } };

            if ("props" in data) {
                const props = await data.props;

                return {
                    props: {
                        ...data.props,
                        title: title ?? props.title ?? null,
                    } as T,
                };
            }

            return data;
        };
    };
}
