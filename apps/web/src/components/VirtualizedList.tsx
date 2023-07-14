import React from "react";
import { createPortal } from "react-dom";
import useMeasure from "react-use-measure";
import _ from "lodash";

import { useVirtualizer } from "@tanstack/react-virtual";

import { Content, MeasureRoot, Root } from "@components/VirtualizedList.styles";

export interface VirtualizedListProps<T> {
    items: T[];
    children: (item: T) => React.ReactNode;
    getItemKey: (item: T) => string;
    defaultHeight: number;
    scrollElement?: HTMLElement | null;
}

export function VirtualizedList<T>({
    items,
    defaultHeight,
    scrollElement,
    getItemKey,
    children,
}: VirtualizedListProps<T>) {
    const heightCache = React.useRef<Record<string, number>>({});
    const [rootRef, { width }] = useMeasure();
    const [measureRef, { height: measuredHeight }] = useMeasure();
    const [itemsToMeasure, setItemsToMeasure] = React.useState<T[]>([]);
    const [cachedItems, setCachedItems] = React.useState<T[]>(items);
    const virtualizer = useVirtualizer({
        estimateSize: index => heightCache.current[getItemKey(cachedItems[index])] ?? defaultHeight,
        getScrollElement: () => scrollElement ?? null,
        count: cachedItems.length,
        getItemKey: index => getItemKey(cachedItems[index]),
    });

    React.useEffect(() => {
        if (!cachedItems.length) {
            setCachedItems(items);
            return;
        }

        const itemIds = items.map(getItemKey);
        const cachedItemIds = cachedItems.map(getItemKey);
        if (_.isEqual(itemIds, cachedItemIds)) {
            return;
        }

        const newItems = _.differenceBy(items, cachedItems, getItemKey);
        const deletedItems = _.differenceBy(cachedItems, items, getItemKey);
        const deletedItemsMap = _.chain(deletedItems).keyBy(getItemKey).mapValues().value();

        setItemsToMeasure([...newItems]);
        setCachedItems(items => items.filter(item => !deletedItemsMap[getItemKey(item)]));
    }, [items, cachedItems, getItemKey]);

    React.useEffect(() => {
        if (!itemsToMeasure.length || !measuredHeight) {
            return;
        }

        heightCache.current[getItemKey(itemsToMeasure[0])] = measuredHeight;
        setItemsToMeasure(items => items.slice(1));
        setCachedItems(items => [itemsToMeasure[0], ...items]);
    }, [getItemKey, itemsToMeasure, measuredHeight]);

    const virtualizedItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    return (
        <Root ref={rootRef} style={{ height: totalSize }}>
            {createPortal(
                <MeasureRoot style={{ width }}>
                    {itemsToMeasure.length > 0 && <div ref={measureRef}>{children(itemsToMeasure[0])}</div>}
                </MeasureRoot>,
                document.body,
            )}
            <Content style={{ transform: `translateY(${virtualizedItems[0]?.start ?? 0}px)` }}>
                {virtualizedItems.map(item => (
                    <div key={item.key} data-index={item.index} ref={virtualizer.measureElement}>
                        {children(cachedItems[item.index])}
                    </div>
                ))}
            </Content>
        </Root>
    );
}
