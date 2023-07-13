import React from "react";

import { PostTimelineType, TimelinePost } from "@services/types";
import { AccountEventMap, BaseAccount } from "@services/base/account";
import { Nullable } from "@utils/types";

const DEFAULT_MAX_COUNT = 50;

export interface TimelineSubscriptionProps {
    type: PostTimelineType;
    children: (items: TimelinePost[], loading: boolean) => React.ReactNode;
    account: Nullable<BaseAccount<string>>;
    maxCount?: number;
    shouldTrim?: boolean;
}
export interface TimelineSubscriptionStates {
    items: TimelinePost[];
    loading: boolean;
}

export class TimelineSubscription extends React.PureComponent<TimelineSubscriptionProps, TimelineSubscriptionStates> {
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
    public async componentDidUpdate(prevProps: TimelineSubscriptionProps) {
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
        const result: TimelinePost[] = [];
        for await (const posts of account.getTimelinePosts(type, maxCount)) {
            result.push(...posts);
            if (result.length >= maxCount) {
                break;
            }
        }

        if (this.props.shouldTrim) {
            result.splice(maxCount);
        }

        this.setState({ items: result, loading: false }, () => {
            account.addEventListener("new-post", this.handleNewPost);
            account.addEventListener("delete-post", this.handleDeletePost);
            account.addEventListener("update-post", this.handleUpdatePost);

            account.startWatch(type);
        });
    };
    private stopSubscription = async (account: BaseAccount<string>) => {
        account.removeEventListener("new-post", this.handleNewPost);
        account.removeEventListener("delete-post", this.handleDeletePost);
        account.removeEventListener("update-post", this.handleUpdatePost);
    };

    private handleNewPost: AccountEventMap["new-post"] = (type, post) => {
        this.setState(prevStates => {
            const { items } = prevStates;
            if (items.find(item => item.id === post.id)) {
                return prevStates;
            }

            const newItems = [post, ...items];
            if (this.props.shouldTrim) {
                newItems.splice(this.props.maxCount ?? DEFAULT_MAX_COUNT);
            }

            return { ...prevStates, items: newItems };
        });
    };
    private handleDeletePost: AccountEventMap["delete-post"] = (type, postId) => {
        this.setState(prevStates => {
            const { items } = prevStates;
            const index = items.findIndex(item => item.id === postId);
            if (index === -1) {
                return prevStates;
            }

            const newItems = [...items];
            newItems.splice(index, 1);

            return { ...prevStates, items: newItems };
        });
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

    public render() {
        const { items, loading } = this.state;

        return <>{this.props.children(items, loading)}</>;
    }
}
