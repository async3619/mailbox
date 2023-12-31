import { NotificationItem, PostTimelineType, TimelinePost, TimelineType } from "../types";
import { EventEmitter } from "../utils";

export interface AccountEventMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => unknown;
    "new-post": (type: PostTimelineType, post: TimelinePost) => void;
    "update-post": (type: PostTimelineType, post: TimelinePost) => void;
    "delete-post": (type: PostTimelineType, postId: string) => void;

    "new-notification": (item: NotificationItem) => void;
}

export abstract class BaseAccount<
    TServiceType extends string,
    TRawData extends Record<string, unknown> = Record<string, unknown>,
> extends EventEmitter<AccountEventMap> {
    private readonly serviceType: TServiceType;

    protected constructor(serviceType: TServiceType) {
        super();

        this.serviceType = serviceType;
    }

    public getServiceType() {
        return this.serviceType;
    }

    public abstract getUniqueId(): string;
    public abstract getUserId(): string;
    public abstract getDisplayName(): string;
    public abstract getAvatarUrl(): string;

    public abstract getNotificationItems(
        count: number,
        after?: NotificationItem["id"],
    ): AsyncIterableIterator<NotificationItem[]>;
    public abstract getTimelinePosts(
        type: PostTimelineType,
        count: number,
        after?: TimelinePost["id"],
    ): AsyncIterableIterator<TimelinePost[]>;

    public abstract startWatch(type: TimelineType): Promise<void>;
    public abstract stopWatch(type: TimelineType): Promise<void>;

    public abstract serialize(): TRawData;
}
