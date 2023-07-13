import dayjs from "dayjs";
import { Subject } from "rxjs";

import { Fn, Nullable } from "@utils/types";

export interface PostAttachment {
    type: "image" | "video" | "gifv" | "audio" | "unknown";
    url: Nullable<string>;
    previewUrl: Nullable<string>;
    width?: number;
    height?: number;
}

export interface PostAuthor {
    avatarUrl: string;
    accountName: string;
    accountId: string;
}

export interface TimelineItem {
    serviceType: string;
    id: string;
    title?: string;
    content: string;
    author: PostAuthor;
    instanceUrl?: string;
    createdAt: dayjs.Dayjs;
    sensitive: boolean;
    attachments: PostAttachment[];
    repostedBy?: PostAuthor;
    originPostAuthor?: Nullable<PostAuthor>;
}

interface SubscriptionCallbacks {
    newItems?: Fn<[TimelineItem], void>;
    deletion?: Fn<[TimelineItem["id"]], void>;
}

interface DeletionNotification {
    type: "deletion";
    id: TimelineItem["id"];
}
interface NewItemNotification<TPostItem> {
    type: "newItem";
    item: TPostItem;
}
export type Notification<TPostItem> = DeletionNotification | NewItemNotification<TPostItem>;

export interface SubscriptionInstance {
    unsubscribe: Fn<[], void>;
}

export abstract class BaseTimeline<TPostItem> {
    private newItem: Subject<TimelineItem>;
    private deletion: Subject<TimelineItem["id"]>;

    protected constructor() {
        this.newItem = new Subject<TimelineItem>();
        this.deletion = new Subject<TimelineItem["id"]>();
    }

    public subscribe({ deletion, newItems }: SubscriptionCallbacks): SubscriptionInstance {
        if (newItems) {
            this.newItem.subscribe({ next: newItems });
        }

        if (deletion) {
            this.deletion.subscribe({ next: deletion });
        }

        return {
            unsubscribe: () => {
                this.newItem.unsubscribe();
                this.deletion.unsubscribe();

                this.newItem = new Subject<TimelineItem>();
                this.deletion = new Subject<TimelineItem["id"]>();
            },
        };
    }

    protected notify(post: Notification<TPostItem>) {
        if (post.type === "deletion") {
            this.deletion.next(post.id);
        } else {
            this.newItem.next(this.compose(post.item));
        }
    }

    public abstract getItems(count: number): Promise<TimelineItem[]>;

    protected abstract compose(post: TPostItem): TimelineItem;
    public abstract start(): Promise<void>;
    public abstract stop(): Promise<void>;
}
