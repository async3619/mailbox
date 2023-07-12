import React from "react";

import { TimelineItem } from "@services/base/timeline";

import { TimelineItemView } from "@components/Timeline/Item";
import { Content, Root } from "@components/Timeline/index.styles";
import { useVirtualizer } from "@tanstack/react-virtual";

export interface TimelineProps {
    items: TimelineItem[];
    scrollElement?: HTMLElement | null;
}

export function Timeline({ items, scrollElement }: TimelineProps) {
    const virtualizer = useVirtualizer({
        estimateSize: () => 200,
        getScrollElement: () => scrollElement ?? null,
        count: items.length,
        getItemKey: index => items[index].id,
    });

    const virtualizedItems = virtualizer.getVirtualItems();

    return (
        <Root style={{ height: virtualizer.getTotalSize() }}>
            <Content style={{ transform: `translateY(${virtualizedItems[0]?.start ?? 0}px)` }}>
                {virtualizedItems.map(item => {
                    return (
                        <div key={item.key} data-index={item.index} ref={virtualizer.measureElement}>
                            <TimelineItemView item={items[item.index]} />
                        </div>
                    );
                })}
            </Content>
        </Root>
    );
}
