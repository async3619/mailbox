import { z } from "zod";
import { login, mastodon } from "masto";

import { AccountHydrator, BaseAccount } from "@services/base/account";
import { GetTokenData } from "@services/mastodon/auth.types";
import { MastodonTimeline } from "@services/mastodon/timeline";

const SERIALIZED_MASTODON_ACCOUNT = z.object({
    serviceType: z.literal("mastodon"),
    instanceUrl: z.string(),
    token: z.object({
        access_token: z.string(),
        token_type: z.string(),
        scope: z.string(),
        created_at: z.number(),
    }),
});

export type SerializedMastodonAccount = z.infer<typeof SERIALIZED_MASTODON_ACCOUNT>;

export class MastodonAccount extends BaseAccount<"mastodon", SerializedMastodonAccount> {
    public static async create(instanceUrl: string, token: GetTokenData) {
        const client = await login({ url: `https://${instanceUrl}`, accessToken: token.access_token });
        const account = await client.v1.accounts.verifyCredentials();

        return new MastodonAccount(instanceUrl, token, client, account);
    }

    private readonly token: GetTokenData;
    private readonly instanceUrl: string;
    private readonly client: mastodon.Client;
    private readonly account: mastodon.v1.AccountCredentials;

    private constructor(
        instanceUrl: string,
        token: GetTokenData,
        client: mastodon.Client,
        account: mastodon.v1.AccountCredentials,
    ) {
        super("mastodon");

        this.instanceUrl = instanceUrl;
        this.token = token;
        this.client = client;
        this.account = account;
    }

    public getUniqueId() {
        return `@${this.account.username}@${this.instanceUrl}`;
    }
    public getUserId() {
        return this.account.username;
    }
    public getDisplayName() {
        return this.account.displayName;
    }
    public getAvatarUrl() {
        return this.account.avatar;
    }

    public getTimeline(): MastodonTimeline {
        return new MastodonTimeline(this, this.client);
    }

    public serialize() {
        return {
            serviceType: this.getServiceType(),
            instanceUrl: this.instanceUrl,
            token: this.token,
        };
    }
}

export class MastodonAccountHydrator extends AccountHydrator<MastodonAccount, SerializedMastodonAccount> {
    public hydrate(): Promise<MastodonAccount> {
        const { token } = this.rawData;

        return MastodonAccount.create(this.rawData.instanceUrl, token);
    }

    public validate(data: Record<string, unknown>): data is SerializedMastodonAccount {
        return SERIALIZED_MASTODON_ACCOUNT.safeParse(data).success;
    }
}
