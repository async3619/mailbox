import React from "react";

import { TimelinePost } from "@services/types";

import { VirtualizedList } from "@components/VirtualizedList";
import { TimelineItemView } from "@components/Timeline/Item";

export interface TimelineProps {
    items: TimelinePost[];
    scrollElement?: HTMLElement | null;
}

export function Timeline({ items, scrollElement }: TimelineProps) {
    return (
        <VirtualizedList items={items} getItemKey={item => item.id} defaultHeight={200} scrollElement={scrollElement}>
            {item => <TimelineItemView item={item} />}
        </VirtualizedList>
    );
}
