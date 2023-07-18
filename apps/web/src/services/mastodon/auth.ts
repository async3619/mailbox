import { APIRouteMap, Fetcher, Route } from "fetcher";

import { MASTODON_TEMP_AUTH_KEY } from "@services/mastodon/constants";

import {
    CreateApplicationBody,
    CreateApplicationData,
    GetTokenBody,
    GetTokenData,
    GetTokenQuery,
} from "@services/mastodon/auth.types";

interface MastodonAPIRoutes extends APIRouteMap {
    "/api/v1/apps": Route<CreateApplicationBody, CreateApplicationData>;
    "/oauth/token": Route<GetTokenBody, GetTokenData, GetTokenQuery>;
}

export class MastodonAuth {
    private readonly fetcher: Fetcher<MastodonAPIRoutes>;
    private readonly instanceUrl: string;

    public constructor(instanceUrl: string) {
        this.instanceUrl = instanceUrl;
        this.fetcher = new Fetcher<MastodonAPIRoutes>(`https://${this.instanceUrl}`);
    }

    public createApplication(appName: string, redirectUrl: string, scopes: string, website: string) {
        return this.fetcher.fetchJson("/api/v1/apps", {
            method: "POST",
            ignoreHTTPError: true,
            body: {
                client_name: appName,
                redirect_uris: redirectUrl,
                scopes,
                website,
            },
        });
    }
    public getToken(clientId: string, clientSecret: string, redirectUri: string, code: string) {
        return this.fetcher.fetchJson("/oauth/token", {
            method: "POST",
            ignoreHTTPError: true,
            body: {
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code,
                grant_type: "authorization_code",
            },
            query: {
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code,
                grant_type: "authorization_code",
            },
        });
    }
    public getLoginUrl(clientId: string, redirectUri: string): string {
        const scope = encodeURIComponent("read write follow");
        redirectUri = encodeURIComponent(redirectUri);

        return `https://${this.instanceUrl}/oauth/authorize?scope=${scope}&response_type=code&redirect_uri=${redirectUri}&client_id=${clientId}&force_login=true`;
    }

    public redirectLogin(data: CreateApplicationData) {
        const { client_id, redirect_uri } = data;
        const loginUrl = this.getLoginUrl(client_id, redirect_uri);

        localStorage.setItem(
            MASTODON_TEMP_AUTH_KEY,
            JSON.stringify({
                instanceUrl: this.instanceUrl,
                ...data,
            }),
        );

        location.href = loginUrl;
    }
}
