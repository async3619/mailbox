import * as z from "zod";

export const MASTODON_TEMP_AUTH_KEY = "MASTODON_TEMP_AUTH_KEY";
export const MASTODON_TEMP_AUTH_DATA = z
    .object({
        id: z.string(),
        name: z.string(),
        client_id: z.string(),
        client_secret: z.string(),
        redirect_uri: z.string(),
        website: z.string(),
        instanceUrl: z.string(),
    })
    .required();

export type MastodonTempAuthData = z.infer<typeof MASTODON_TEMP_AUTH_DATA>;
export function isMastodonTempAuthData(data: unknown): data is MastodonTempAuthData {
    try {
        MASTODON_TEMP_AUTH_DATA.parse(data);
        return true;
    } catch {
        return false;
    }
}
