import React from "react";
import { Subject, Subscription } from "rxjs";
import dayjs from "dayjs";

import { Fn, Nullable } from "@utils/types";

export interface PostAttachment {
    type: "image" | "video" | "gifv" | "audio" | "unknown";
    url: Nullable<string>;
    previewUrl: Nullable<string>;
}

export interface PostItem {
    serviceType: string;
    id: string;
    title?: string;
    content: string;
    avatarUrl: string;
    accountName: string;
    accountId: string;
    instanceUrl?: string;
    createdAt: dayjs.Dayjs;
    attachments: PostAttachment[];
}

export abstract class BaseTimeline<TPostItem> {
    private readonly subject: Subject<PostItem>;

    protected constructor() {
        this.subject = new Subject<PostItem>();
    }

    public subscribe(subscriber: Fn<[PostItem], void>) {
        return this.subject.subscribe({ next: subscriber });
    }

    public notify(post: TPostItem) {
        this.subject.next(this.compose(post));
    }

    public abstract getItems(count: number): Promise<PostItem[]>;

    public abstract compose(post: TPostItem): PostItem;

    public abstract start(): Promise<void>;
    public abstract stop(): Promise<void>;
}

export function useSubscribeTimeline<TPostItem>(
    timeline: Nullable<BaseTimeline<TPostItem>>,
    maxLength = 50,
): [boolean, PostItem[]] {
    const [initialized, setInitialized] = React.useState(false);
    const [items, setItems] = React.useState<PostItem[]>([]);
    const subscriber = React.useRef<Subscription | null>(null);
    const callback = React.useCallback(
        (item: PostItem) => {
            setItems(oldItems => {
                const items = [item, ...oldItems];
                if (items.length > maxLength) {
                    return items.slice(0, maxLength);
                }

                return items;
            });
        },
        [maxLength],
    );

    React.useEffect(() => {
        if (!timeline) {
            return;
        }

        timeline.getItems(maxLength).then(items => {
            setItems(items);
            setInitialized(true);
        });
    }, [maxLength, timeline]);

    React.useEffect(() => {
        if (!timeline || !initialized) {
            return;
        }

        timeline.start();

        return () => {
            timeline.stop();
        };
    }, [timeline, initialized]);

    React.useEffect(() => {
        subscriber.current = timeline?.subscribe(callback) ?? null;

        return () => {
            if (!subscriber.current) {
                return;
            }

            subscriber.current.unsubscribe();
        };
    }, [callback, timeline]);

    return [!initialized, items];
}
