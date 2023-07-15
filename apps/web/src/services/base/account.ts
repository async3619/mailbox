import { PostTimelineType, TimelinePost, TimelineType } from "@services/types";
import { EventEmitter } from "@utils/events";

export interface AccountEventMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (...args: any[]) => unknown;
    "new-post": (type: PostTimelineType, post: TimelinePost) => void;
    "update-post": (type: PostTimelineType, post: TimelinePost) => void;
    "delete-post": (type: PostTimelineType, postId: string) => void;
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

    public abstract getTimelinePosts(
        type: PostTimelineType,
        count: number,
        after?: TimelinePost["id"],
    ): AsyncIterableIterator<TimelinePost[]>;

    public abstract startWatch(type: TimelineType): Promise<void>;
    public abstract stopWatch(type: TimelineType): Promise<void>;

    public abstract serialize(): TRawData;
}

export abstract class AccountHydrator<
    TAccount extends BaseAccount<string, TRawData>,
    TRawData extends Record<string, unknown> = Record<string, unknown>,
> {
    protected readonly rawData: Readonly<TRawData>;

    public constructor(data: Record<string, unknown>) {
        if (!this.validate(data)) {
            throw new Error("Invalid data");
        }

        this.rawData = data;
    }

    public abstract validate(data: Record<string, unknown>): data is TRawData;
    public abstract hydrate(): Promise<TAccount>;
}
