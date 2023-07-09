import { KeyOf } from "@utils/types";

export type Method = "GET" | "POST" | "PUT" | "DELETE";
export type APIRouteMap = Record<string, Route<unknown, unknown, unknown>>;
export type Route<TBody, TData, TQuery = never> = [body: TBody, data: TData, query: TQuery];

interface FetchOptions<TRoute extends Route<unknown, unknown, unknown>> {
    method: Method;
    headers?: Record<string, string>;
    ignoreHTTPError?: boolean;
    query?: TRoute extends Route<unknown, unknown, infer TQuery> ? (TQuery extends never ? never : TQuery) : never;
    body?: TRoute extends Route<infer TBody, unknown, unknown> ? (TBody extends never ? never : TBody) : never;
    bodyType?: "json" | "form";
}

export class Fetcher<APIRoutes extends APIRouteMap> {
    public constructor(private readonly baseUrl: string) {}

    public async fetch<RouteName extends KeyOf<APIRoutes>>(
        path: RouteName,
        options?: FetchOptions<APIRoutes[RouteName]>,
    ) {
        const headers: Record<string, string> = options?.headers ?? {};
        let body: FormData | string | undefined;
        if (options?.body) {
            if (!options.bodyType || options.bodyType === "json") {
                headers["Content-Type"] = "application/json";
                body = JSON.stringify(options.body);
            } else if (options.bodyType === "form") {
                body = new FormData();
                for (const [key, value] of Object.entries(options.body)) {
                    body.append(key, `${value}`);
                }
            }
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
            method: options?.method ?? "GET",
            headers,
            body,
        });

        if (!response.ok && !options?.ignoreHTTPError) {
            throw new Error(response.statusText);
        }

        return response;
    }
    public async fetchJson<RouteName extends KeyOf<APIRoutes>>(
        path: RouteName,
        options?: FetchOptions<APIRoutes[RouteName]>,
    ): Promise<APIRoutes[RouteName][1]> {
        const response = await this.fetch(path, options);
        return response.json();
    }
}
