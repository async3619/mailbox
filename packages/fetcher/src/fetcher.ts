import { KeyOf } from "./types";
import { getErrorMessage } from "./utils";

export type Method = "GET" | "POST" | "PUT" | "DELETE";
export type APIRouteMap = Record<string, Route<unknown, unknown, unknown>>;
export type Route<TBody, TData, TQuery = never> = [body: TBody, data: TData, query: TQuery];

export interface FetchOptions<TRoute extends Route<unknown, unknown, unknown>> {
    method: Method;
    headers?: Record<string, string>;
    ignoreHTTPError?: boolean;
    query?: TRoute extends Route<unknown, unknown, infer TQuery> ? (TQuery extends never ? never : TQuery) : never;
    body?: TRoute extends Route<infer TBody, unknown, unknown> ? (TBody extends never ? never : TBody) : never;
    bodyType?: "json" | "form";
    retryCount?: number;
    retryDelay?: number;
}

export class Fetcher<APIRoutes extends APIRouteMap> {
    public constructor(private readonly baseUrl: string) {}

    public async fetch<RouteName extends KeyOf<APIRoutes>>(
        path: RouteName,
        options?: FetchOptions<APIRoutes[RouteName]>,
    ): Promise<Response> {
        const { method = "GET", retryCount = 5, retryDelay = 200 } = options ?? {};
        const url = `${this.baseUrl}${path}`;

        try {
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

            const response = await fetch(url, { method, headers, body });
            if (!response.ok && !options?.ignoreHTTPError) {
                throw new Error(`${response.status} ${response.statusText}`);
            }

            return response;
        } catch (e) {
            const message = getErrorMessage(e);
            if (retryCount > 0) {
                if (retryDelay > 0) {
                    await new Promise(res => setTimeout(res, retryDelay));
                }

                console.warn(`Retrying fetch to '${url}' due to error: ${message}`);

                return this.fetch(path, {
                    ...(options ?? {}),
                    method,
                    retryCount: retryCount - 1,
                });
            }

            throw new Error(`Failed to fetch '${url}': ${message}`);
        }
    }
    public async fetchJson<RouteName extends KeyOf<APIRoutes>>(
        path: RouteName,
        options?: FetchOptions<APIRoutes[RouteName]>,
    ): Promise<APIRoutes[RouteName][1]> {
        const response = await this.fetch(path, options);
        return response.json();
    }
}
