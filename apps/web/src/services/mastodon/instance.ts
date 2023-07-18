import { APIRouteMap, Fetcher, Route } from "fetcher";

import { BaseInstance } from "@services/base/instance";

export class MastodonInstance extends BaseInstance {
    private static readonly instanceCache: Record<string, MastodonInstance> = {};

    public static create(instanceUrl: string): MastodonInstance {
        const isHttpUrl = /^https?:\/\/(.+)$/.test(instanceUrl);
        if (!isHttpUrl) {
            instanceUrl = `https://${instanceUrl}`;
        }

        if (!(instanceUrl in MastodonInstance.instanceCache)) {
            const instance = new MastodonInstance(instanceUrl);
            MastodonInstance.instanceCache[instanceUrl] = instance;

            return instance;
        }

        return MastodonInstance.instanceCache[instanceUrl];
    }

    private readonly instanceUrl: string;
    private readonly fetcher: Fetcher<MastodonAPIRoutes>;

    private constructor(instanceUrl: string) {
        super();

        this.instanceUrl = instanceUrl;
        this.fetcher = new Fetcher<MastodonAPIRoutes>(this.instanceUrl);
    }

    public async getCustomEmojis() {
        const data = await this.fetcher.fetchJson("/api/v1/custom_emojis", {
            method: "GET",
        });

        return data.map(item => ({
            name: item.shortcode,
            url: item.url,
        }));
    }
}
