import { z } from "zod";
import { login, mastodon, WsEvents } from "masto";
import dayjs from "dayjs";
import compact from "lodash/compact";

import { AccountHydrator, BaseAccount } from "@services/base/account";
import { GetTokenData } from "@services/mastodon/auth.types";
import {
    BaseNotificationItem,
    NotificationItem,
    PostAuthor,
    PostTimelineType,
    TimelinePost,
    TimelineType,
} from "@services/types";

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

    private readonly watcherMap = new Map<PostTimelineType, WsEvents>();
    private readonly authorMap = new Map<string, PostAuthor>();
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

    public async *getTimelinePosts(type: PostTimelineType, limit: number, after?: TimelinePost["id"]) {
        let maxId: string | undefined = after;
        const getItems = () => {
            switch (type) {
                case TimelineType.Home:
                    return this.client.v1.timelines.listHome({ limit, maxId });

                case TimelineType.Local:
                case TimelineType.Federated:
                    return this.client.v1.timelines.listPublic({
                        limit,
                        maxId,
                        local: type === TimelineType.Local,
                    });
            }
        };

        while (true) {
            const posts = await getItems();
            if (posts.length === 0) {
                break;
            }

            yield posts.map(post => this.composePost(post));
            maxId = posts[posts.length - 1].id;
        }
    }
    public async *getNotificationItems(limit: number, after?: TimelinePost["id"]) {
        let maxId: string | undefined = after;
        while (true) {
            const items = await this.client.v1.notifications.list({ limit, maxId });
            if (items.length === 0) {
                break;
            }

            yield items.map(item => this.composeNotification(item));
            maxId = items[items.length - 1].id;
        }
    }

    public async startWatch(type: TimelineType) {
        const watcherType = type === TimelineType.Notifications ? TimelineType.Home : type;
        if (this.watcherMap.has(watcherType)) {
            return;
        }

        const ws = await (() => {
            switch (type) {
                case TimelineType.Notifications:
                case TimelineType.Home:
                    return this.client.v1.stream.streamUser();

                case TimelineType.Local:
                    return this.client.v1.stream.streamCommunityTimeline();

                case TimelineType.Federated:
                    return this.client.v1.stream.streamPublicTimeline();
            }
        })();

        ws.on("update", post => this.emit("new-post", watcherType, this.composePost(post)));
        ws.on("status.update", post => this.emit("update-post", watcherType, this.composePost(post)));
        ws.on("delete", id => this.emit("delete-post", watcherType, id));

        if (type === TimelineType.Notifications) {
            ws.on("notification", item => this.emit("new-notification", this.composeNotification(item)));
        }

        this.watcherMap.set(watcherType, ws);
    }
    public async stopWatch(type: TimelineType) {
        const watcherType = type === TimelineType.Notifications ? TimelineType.Home : type;
        const ws = this.watcherMap.get(watcherType);
        if (!ws) {
            return;
        }

        await ws.disconnect();
        this.watcherMap.delete(watcherType);
    }

    public serialize() {
        return {
            serviceType: this.getServiceType(),
            instanceUrl: this.instanceUrl,
            token: this.token,
        };
    }

    private composeUser(user: mastodon.v1.Account): PostAuthor {
        const instanceUrl = new URL(user.url).hostname;

        return {
            avatarUrl: user.avatarStatic,
            accountName: user.displayName || user.username,
            accountId: `@${user.acct}`,
            instanceUrl,
        };
    }
    private composePost(post: mastodon.v1.Status): TimelinePost {
        if (!post.account.url) {
            throw new Error("Invalid post data");
        }

        const authorToCache = compact([post.account, post.reblog?.account]);
        for (const author of authorToCache) {
            if (!this.authorMap.has(author.id)) {
                this.authorMap.set(author.id, this.composeUser(author));
            }
        }

        const parsedUrl = new URL(post.account.url);
        const target = post.reblog ?? post;
        const originPostAuthor = post.inReplyToAccountId ? this.authorMap.get(post.inReplyToAccountId) : null;

        return {
            serviceType: this.getServiceType(),
            id: post.id,
            content: target.content,
            instanceUrl: parsedUrl.hostname,
            createdAt: dayjs(target.createdAt),
            sensitive: target.sensitive,
            originPostAuthor,
            attachments: target.mediaAttachments.map(attachment => ({
                type: attachment.type,
                url: attachment.url,
                previewUrl: attachment.previewUrl,
                width: attachment.meta?.original?.width,
                height: attachment.meta?.original?.height,
            })),
            author: {
                avatarUrl: target.account.avatarStatic,
                accountName: target.account.displayName || target.account.username,
                accountId: `@${target.account.acct}`,
                instanceUrl: parsedUrl.hostname,
            },
            repostedBy: post.reblog ? this.composeUser(post.account) : undefined,
        };
    }
    private composeNotification(item: mastodon.v1.Notification): NotificationItem {
        const base: BaseNotificationItem = {
            id: item.id,
            createdAt: dayjs(item.createdAt),
            user: this.composeUser(item.account),
        };

        if (item.type === "favourite" || item.type === "reblog" || item.type === "mention" || item.type === "poll") {
            if (!item.status) {
                throw new Error("Invalid notification data: No status data found.");
            }

            return {
                ...base,
                type: item.type,
                post: this.composePost(item.status),
            };
        } else if (item.type === "follow") {
            return {
                ...base,
                type: item.type,
            };
        } else {
            throw new Error(`Invalid notification type: ${item.type}`);
        }
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
