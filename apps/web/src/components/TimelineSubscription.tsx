import React from "react";

import { BaseTimeline, SubscriptionInstance, TimelineItem } from "@services/base/timeline";

import { Nullable } from "@utils/types";

export interface TimelineSubscriptionProps {
    timeline: Nullable<BaseTimeline<unknown>>;
    children: (items: TimelineItem[], loading: boolean) => React.ReactNode;
    maxCount?: number;
    shouldTrim?: boolean;
}
export interface TimelineSubscriptionStates {
    items: TimelineItem[];
    loading: boolean;
}

export class TimelineSubscription extends React.PureComponent<TimelineSubscriptionProps, TimelineSubscriptionStates> {
    private subscriptionInstance: SubscriptionInstance | null = null;

    public state: TimelineSubscriptionStates = {
        items: [],
        loading: true,
    };

    public async componentDidMount() {
        const { timeline, maxCount = 50 } = this.props;
        if (!timeline) {
            return;
        }

        let items: TimelineItem[] = [];
        while (true) {
            const result = await timeline.getItems(maxCount);
            if (items.length >= maxCount || result.length === 0) {
                break;
            }

            items = items.concat(result);
        }

        await timeline.start();
        this.subscriptionInstance = timeline.subscribe({
            newItems: this.handleTimelineUpdate,
            deletion: this.handleTimelineDeletion,
        });

        this.setState({ items, loading: false });
    }
    public async componentWillUnmount() {
        const { timeline } = this.props;
        if (!timeline) {
            return;
        }

        await timeline.stop();

        if (this.subscriptionInstance) {
            this.subscriptionInstance.unsubscribe();
        }
    }

    private handleTimelineUpdate = (items: TimelineItem) => {
        const { shouldTrim = true, maxCount = 50 } = this.props;

        this.setState(prevState => {
            const newItems = [items, ...prevState.items];
            if (shouldTrim && maxCount && newItems.length > maxCount) {
                newItems.length = maxCount;
            }

            return { items: newItems };
        });
    };
    private handleTimelineDeletion = (id: TimelineItem["id"]) => {
        this.setState(prevState => ({
            items: prevState.items.filter(item => item.id !== id),
        }));
    };

    public render() {
        const { items, loading } = this.state;

        return <>{this.props.children(items, loading)}</>;
    }
}
