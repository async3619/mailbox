import React from "react";

import { TimelinePost } from "@services/types";

import { VirtualizedList } from "@components/VirtualizedList";
import { TimelineItemView } from "@components/Timeline/Item";

export interface TimelineProps {
    items: TimelinePost[];
    scrollElement?: HTMLElement | null;
    onLoadMore?(lastItemId: string): Promise<TimelinePost[]>;
}

export function Timeline({ items, scrollElement, onLoadMore }: TimelineProps) {
    const [spoilerOpenedState, setSpoilerOpenedState] = React.useState<Record<string, boolean>>({});
    const handleSpoilerStatusChange = React.useCallback((post: TimelinePost, opened: boolean) => {
        setSpoilerOpenedState(state => ({
            ...state,
            [post.id]: opened,
        }));
    }, []);

    return (
        <VirtualizedList
            items={items}
            getItemKey={item => item.id}
            defaultHeight={200}
            scrollElement={scrollElement}
            onLoadMore={onLoadMore}
        >
            {item => (
                <TimelineItemView
                    item={item}
                    onSpoilerStatusChange={handleSpoilerStatusChange}
                    spoilerOpened={spoilerOpenedState[item.id]}
                />
            )}
        </VirtualizedList>
    );
}
