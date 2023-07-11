import dayjs from "dayjs";
import { mastodon, WsEvents } from "masto";

import { BaseTimeline, TimelineItem } from "@services/base/timeline";
import { MastodonAccount } from "@services/mastodon/account";

import { Resolved } from "@utils/types";

export type MastodonStatus = Resolved<ReturnType<mastodon.v1.StatusRepository["fetch"]>>;

export class MastodonTimeline extends BaseTimeline<MastodonStatus> {
    private readonly account: MastodonAccount;
    private readonly client: mastodon.Client;

    private currentConnection: WsEvents | null = null;

    public constructor(account: MastodonAccount, client: mastodon.Client) {
        super();

        this.account = account;
        this.client = client;
    }

    public async getItems(count: number): Promise<TimelineItem[]> {
        const result: MastodonStatus[] = [];
        let maxId: string | null = null;
        while (true) {
            const statuses = await this.client.v1.timelines.listPublic({ limit: count, maxId });
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

        return {
            serviceType: this.account.getServiceType(),
            id: post.id,
            content: post.content,
            avatarUrl: post.account.avatarStatic,
            accountName: post.account.displayName || post.account.username,
            accountId: `@${post.account.acct}`,
            instanceUrl: parsedUrl.hostname,
            createdAt: dayjs(post.createdAt),
            attachments: post.mediaAttachments.map(attachment => ({
                type: attachment.type,
                url: attachment.url,
                previewUrl: attachment.previewUrl,
            })),
        };
    }

    public async start() {
        this.currentConnection = await this.client.v1.stream.streamPublicTimeline();
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
