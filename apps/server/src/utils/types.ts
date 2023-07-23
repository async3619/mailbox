import { APIRouteMap, Route } from "fetcher";

export type MastodonEmojiData = Array<{ shortcode: string; url: string; static_url: string }>;

export interface MastodonAPIRoutes extends APIRouteMap {
    "/api/v1/custom_emojis": Route<never, MastodonEmojiData>;
}

export interface MisskeyEmojiData {
    emojis: Array<{ name: string; category: string | null; url: string }>;
}
export interface MisskeyMetaData {
    version: string;
    emojis?: MisskeyEmojiData["emojis"];
}

export interface MisskeyAPIRoutes extends APIRouteMap {
    "/api/emojis": Route<Record<string, never>, MisskeyEmojiData>;
    "/api/meta": Route<never, MisskeyMetaData>;
}
