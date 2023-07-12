import _ from "lodash";

import React from "react";
import useMeasure from "react-use-measure";
import { useVirtualizer } from "@tanstack/react-virtual";

import { TimelineItem } from "@services/base/timeline";

import { TimelineItemView } from "@components/Timeline/Item";
import { CacheRenderer, Content, Root } from "@components/Timeline/index.styles";

export interface TimelineProps {
    items: TimelineItem[];
    scrollElement?: HTMLElement | null;
}

export function Timeline({ items, scrollElement }: TimelineProps) {
    const [measureRef, { width }] = useMeasure();
    const heightMap = React.useRef<Record<string, number>>({});
    const lastHeight = React.useRef<number>(0);
    const [cachedItems, setCachedItems] = React.useState<TimelineItem[]>(items);
    const [itemsToMeasure, setItemsToMeasure] = React.useState<TimelineItem[]>([]);
    const virtualizer = useVirtualizer({
        estimateSize: idx => heightMap.current[cachedItems[idx].id] ?? 200,
        getScrollElement: () => scrollElement ?? null,
        count: cachedItems.length,
        getItemKey: index => cachedItems[index].id,
    });

    const virtualizedItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    React.useEffect(() => {
        const scrollHeight = virtualizer.getTotalSize();
        const scrollY = scrollElement?.scrollTop ?? 0;
        if (scrollHeight === lastHeight.current || scrollY === 0) {
            return;
        }

        const diff = scrollHeight - lastHeight.current;
        scrollElement?.scrollTo({ top: scrollY + diff });

        lastHeight.current = scrollHeight;
    }, [cachedItems, virtualizer, scrollElement]);

    React.useEffect(() => {
        if (!cachedItems.length) {
            setCachedItems(items);
            return;
        }

        const newItems = _.differenceBy(items, cachedItems, "id");
        setItemsToMeasure(newItems);
    }, [items, cachedItems]);

    const handleHeightMeasured = React.useCallback((h: number, item: TimelineItem) => {
        heightMap.current[item.id] = h;

        setItemsToMeasure(prev => prev.filter(i => i.id !== item.id));
        setCachedItems(prev => [item, ...prev]);
    }, []);

    return (
        <Root ref={measureRef} style={{ height: totalSize }}>
            <CacheRenderer style={{ width }}>
                {itemsToMeasure.map(item => (
                    <TimelineItemView key={item.id} item={item} onHeightChange={h => handleHeightMeasured(h, item)} />
                ))}
            </CacheRenderer>
            <Content style={{ transform: `translateY(${virtualizedItems[0]?.start ?? 0}px)` }}>
                {virtualizedItems.map(item => {
                    return (
                        <div key={item.key} data-index={item.index} ref={virtualizer.measureElement}>
                            <TimelineItemView item={cachedItems[item.index]} />
                        </div>
                    );
                })}
            </Content>
        </Root>
    );
}
