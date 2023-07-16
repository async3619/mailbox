import _ from "lodash";
import React from "react";

import { NotificationItem, PostTimelineType, TimelinePost, TimelineType } from "@services/types";
import { AccountEventMap, BaseAccount } from "@services/base/account";
import { AsyncFn, Nullable } from "@utils/types";

const DEFAULT_MAX_COUNT = 20;

export interface BaseSubscriptionProps<T> {
    children: (items: T[], loading: boolean, loadMore?: AsyncFn<[string], T[]>) => React.ReactNode;
    account: Nullable<BaseAccount<string>>;
    maxCount?: number;
    shouldTrim?: boolean;
    loadMore?: boolean;
}
export interface TimelineSubscriptionProps extends BaseSubscriptionProps<TimelinePost> {
    type: PostTimelineType;
}
export interface NotificationSubscriptionProps extends BaseSubscriptionProps<NotificationItem> {
    type: TimelineType.Notifications;
}
export type SubscriptionProps = TimelineSubscriptionProps | NotificationSubscriptionProps;

export interface TimelineSubscriptionStates {
    items: (TimelinePost | NotificationItem)[];
    loading: boolean;
}

export class TimelineSubscription extends React.PureComponent<SubscriptionProps, TimelineSubscriptionStates> {
    public state: TimelineSubscriptionStates = {
        items: [],
        loading: true,
    };

    public async componentDidMount() {
        if (!this.props.account) {
            return;
        }

        await this.startSubscription(this.props.account);
    }
    public async componentDidUpdate(prevProps: SubscriptionProps) {
        if (prevProps.account === this.props.account) {
            return;
        }

        if (prevProps.account) {
            await this.stopSubscription(prevProps.account);
        }

        if (this.props.account) {
            await this.startSubscription(this.props.account);
        }
    }
    public async componentWillUnmount() {
        if (!this.props.account) {
            return;
        }

        await this.stopSubscription(this.props.account);
    }

    private startSubscription = async (account: BaseAccount<string>) => {
        const { maxCount = DEFAULT_MAX_COUNT, type } = this.props;
        const result: (TimelinePost | NotificationItem)[] = [];

        let iterator: AsyncIterableIterator<TimelinePost[] | NotificationItem[]>;
        if (type !== TimelineType.Notifications) {
            iterator = account.getTimelinePosts(type, maxCount);
        } else {
            iterator = account.getNotificationItems(maxCount);
        }

        for await (const posts of iterator) {
            result.push(...posts);
            if (result.length >= maxCount) {
                break;
            }
        }

        if (this.props.shouldTrim) {
            result.splice(maxCount);
        }

        this.setState({ items: result, loading: false }, () => {
            if (type !== TimelineType.Notifications) {
                account.addEventListener("new-post", this.handleNewPost);
                account.addEventListener("delete-post", this.handleDeletePost);
                account.addEventListener("update-post", this.handleUpdatePost);
            } else {
                account.addEventListener("new-notification", this.handleAddNotification);
            }

            account.startWatch(type);
        });
    };
    private stopSubscription = async (account: BaseAccount<string>) => {
        account.removeEventListener("new-post", this.handleNewPost);
        account.removeEventListener("delete-post", this.handleDeletePost);
        account.removeEventListener("update-post", this.handleUpdatePost);
    };

    private handleLoadMore = async (lastId: string) => {
        const { account, type, maxCount = DEFAULT_MAX_COUNT } = this.props;
        if (!account) {
            throw new Error("Account is not available");
        }

        this.setState({ loading: true });

        const result: Array<TimelinePost | NotificationItem> = [];
        const iterator =
            type === TimelineType.Notifications
                ? account.getNotificationItems(maxCount, lastId)
                : account.getTimelinePosts(type, maxCount, lastId);

        for await (const posts of iterator) {
            result.push(...posts);
            if (result.length >= maxCount) {
                break;
            }
        }

        result.splice(maxCount);
        this.setState({ loading: false });

        return result;
    };
    private handleNewPost: AccountEventMap["new-post"] = (type, post) => {
        if (type !== this.props.type) {
            return;
        }

        this.setState(prevStates => {
            const { items } = prevStates;
            if (items.find(item => item.id === post.id)) {
                return prevStates;
            }

            const newItems = _.uniqBy([post, ...items], item => item.id);
            if (this.props.shouldTrim) {
                newItems.splice(this.props.maxCount ?? DEFAULT_MAX_COUNT);
            }

            return { ...prevStates, items: newItems };
        });
    };
    private handleDeletePost: AccountEventMap["delete-post"] = (type, postId) => {
        this.setState(prevStates => ({
            ...prevStates,
            items: prevStates.items.filter(item => item.id !== postId),
        }));
    };
    private handleUpdatePost: AccountEventMap["update-post"] = (type, post) => {
        this.setState(prevStates => {
            const { items } = prevStates;
            const index = items.findIndex(item => item.id === post.id);
            if (index === -1) {
                return prevStates;
            }

            const newItems = [...items];
            newItems[index] = post;

            return { ...prevStates, items: newItems };
        });
    };
    private handleAddNotification: AccountEventMap["new-notification"] = notification => {
        this.setState(prevStates => {
            const { items } = prevStates;
            if (items.find(item => item.id === notification.id)) {
                return prevStates;
            }

            const newItems = _.uniqBy([notification, ...items], item => item.id);
            if (this.props.shouldTrim) {
                newItems.splice(this.props.maxCount ?? DEFAULT_MAX_COUNT);
            }

            return { ...prevStates, items: newItems };
        });
    };

    public render() {
        const { loadMore } = this.props;
        const { items, loading } = this.state;

        if (this.props.type === TimelineType.Notifications) {
            const loadMoreFn = this.handleLoadMore as AsyncFn<[string], NotificationItem[]>;
            return <>{this.props.children(items as NotificationItem[], loading, loadMore ? loadMoreFn : undefined)}</>;
        } else {
            const loadMoreFn = this.handleLoadMore as AsyncFn<[string], TimelinePost[]>;
            return <>{this.props.children(items as TimelinePost[], loading, loadMore ? loadMoreFn : undefined)}</>;
        }
    }
}
