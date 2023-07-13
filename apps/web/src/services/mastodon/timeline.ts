import dayjs from "dayjs";
import { mastodon, WsEvents } from "masto";

import { BaseTimeline, TimelineItem } from "@services/base/timeline";
import { MastodonAccount } from "@services/mastodon/account";

import { MastodonTimelineData } from "@components/Column/types";

import { Nullable, Resolved } from "@utils/types";

export type MastodonStatus = Resolved<ReturnType<mastodon.v1.StatusRepository["fetch"]>>;

export class MastodonTimeline extends BaseTimeline<MastodonStatus> {
    private readonly account: MastodonAccount;
    private readonly client: mastodon.Client;
    private readonly data: Readonly<MastodonTimelineData>;

    private currentConnection: WsEvents | null = null;

    public constructor(account: MastodonAccount, client: mastodon.Client, data: MastodonTimelineData) {
        super();

        this.account = account;
        this.client = client;
        this.data = { ...data };
    }

    public async getItems(count: number): Promise<TimelineItem[]> {
        const getStatus = (count: number, maxId?: Nullable<string>) => {
            if (this.data.timelineType === "fed" || this.data.timelineType === "local") {
                return this.client.v1.timelines.listPublic({
                    limit: count,
                    local: this.data.timelineType === "local",
                    maxId,
                });
            } else {
                return this.client.v1.timelines.listHome({ limit: count, maxId });
            }
        };

        const result: MastodonStatus[] = [];
        let maxId: string | null = null;
        while (true) {
            const statuses = await getStatus(count, maxId);
            result.push(...statuses);

            if (result.length >= count) {
                break;
            }

            maxId = statuses[statuses.length - 1].id;
        }

        if (result.length > count) {
            result.splice(count);
        }

        return result.map(status => this.compose(status));
    }

    protected compose(post: MastodonStatus): TimelineItem {
        if (!post.account.url) {
            throw new Error("Invalid post data");
        }

        const parsedUrl = new URL(post.account.url);
        const target = post.reblog ?? post;

        return {
            serviceType: this.account.getServiceType(),
            id: target.id,
            content: target.content,
            instanceUrl: parsedUrl.hostname,
            createdAt: dayjs(target.createdAt),
            sensitive: target.sensitive,
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
            },
            repostedBy: post.reblog
                ? {
                      avatarUrl: post.account.avatarStatic,
                      accountName: post.account.displayName || post.account.username,
                      accountId: `@${post.account.acct}`,
                  }
                : undefined,
        };
    }

    public async start() {
        const stream = () => {
            switch (this.data.timelineType) {
                case "home":
                    return this.client.v1.stream.streamUser();

                case "local":
                    return this.client.v1.stream.streamCommunityTimeline();

                case "fed":
                    return this.client.v1.stream.streamPublicTimeline();
            }
        };

        this.currentConnection = await stream();
        this.currentConnection.on("update", status => {
            this.notify({ type: "newItem", item: status });
        });

        this.currentConnection.on("delete", id => {
            this.notify({ type: "deletion", id });
        });
    }
    public async stop() {
        if (!this.currentConnection) {
            return;
        }

        this.currentConnection.disconnect();
    }
}
