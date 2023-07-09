import { BaseInstance, EmojiItem } from "@services/base/instance";
import { APIRouteMap, Fetcher, Route } from "@utils/fetcher";

interface MisskeyAPIRoutes extends APIRouteMap {
    "/api/emojis": Route<
        Record<string, never>,
        {
            emojis: Array<{ name: string; category: string; url: string }>;
        }
    >;
}

export class MisskeyInstance extends BaseInstance {
    private static readonly instanceCache: Record<string, MisskeyInstance> = {};

    public static create(instanceUrl: string): MisskeyInstance {
        const isHttpUrl = /^https?:\/\/(.+)$/.test(instanceUrl);
        if (!isHttpUrl) {
            instanceUrl = `https://${instanceUrl}`;
        }

        if (!(instanceUrl in MisskeyInstance.instanceCache)) {
            const instance = new MisskeyInstance(instanceUrl);
            MisskeyInstance.instanceCache[instanceUrl] = instance;

            return instance;
        }

        return MisskeyInstance.instanceCache[instanceUrl];
    }

    private readonly instanceUrl: string;
    private readonly fetcher: Fetcher<MisskeyAPIRoutes>;

    private constructor(instanceUrl: string) {
        super();

        this.instanceUrl = instanceUrl;
        this.fetcher = new Fetcher<MisskeyAPIRoutes>(this.instanceUrl);
    }

    public async getCustomEmojis(): Promise<EmojiItem[]> {
        const data = await this.fetcher.fetchJson("/api/emojis", {
            method: "POST",
            body: {},
            bodyType: "json",
        });

        return data.emojis.map(item => ({
            name: item.name,
            url: item.url,
        }));
    }
}
