import _ from "lodash";

import React from "react";
import Measure, { ContentRect } from "react-measure";
import { createPortal } from "react-dom";
import useMeasure from "react-use-measure";

import { useVirtualizer } from "@tanstack/react-virtual";

import { Content, MeasureRoot, Root } from "@components/VirtualizedList.styles";

export interface VirtualizedListProps<T> {
    items: T[];
    children: (item: T) => React.ReactNode;
    getItemKey: (item: T) => string;
    defaultHeight: number;
    scrollElement?: HTMLElement | null;
}

interface MeasureItemHolder<T> {
    measuredItems: T[];
    itemsToMeasure: T[];
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
    const lastMeasuredItemCount = React.useRef<number>(0);
    const [{ itemsToMeasure, measuredItems }, setItemHolder] = React.useState<MeasureItemHolder<T>>({
        measuredItems: [],
        itemsToMeasure: [],
    });
    const virtualizer = useVirtualizer({
        estimateSize: index => heightCache.current[getItemKey(measuredItems[index])] ?? defaultHeight,
        getScrollElement: () => scrollElement ?? null,
        count: measuredItems.length,
        getItemKey: index => getItemKey(measuredItems[index]),
    });

    const virtualizedItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    React.useEffect(() => {
        if (!measuredItems.length) {
            setItemHolder(prev => ({ ...prev, measuredItems: items }));
            return;
        }

        const oldItems = _.uniqBy([...measuredItems, ...itemsToMeasure], getItemKey);
        const newItems = _.differenceBy(items, oldItems, getItemKey);
        if (newItems.length === 0) {
            return;
        }

        const deletedItems = _.differenceBy(measuredItems, items, getItemKey);
        const deletedItemIds = deletedItems.map(getItemKey);
        const deletedItemMap = _.keyBy(deletedItemIds);

        setItemHolder(prev => ({
            ...prev,
            itemsToMeasure: [...prev.itemsToMeasure, ...newItems],
            measuredItems:
                deletedItemIds.length > 0
                    ? prev.measuredItems.filter(item => !deletedItemMap[getItemKey(item)])
                    : prev.measuredItems,
        }));
    }, [measuredItems, items, getItemKey, itemsToMeasure]);

    const handleResize = React.useCallback(
        (item: T, data: ContentRect) => {
            if (!data.bounds) {
                return;
            }

            const { height } = data.bounds;
            const itemId = getItemKey(item);
            if (heightCache.current[itemId] === height) {
                return;
            }

            heightCache.current[itemId] = height;

            setItemHolder(prev => ({
                itemsToMeasure: prev.itemsToMeasure.filter(i => getItemKey(i) !== itemId),
                measuredItems: [item, ...prev.measuredItems],
            }));
        },
        [getItemKey],
    );

    React.useEffect(() => {
        if (lastMeasuredItemCount.current > measuredItems.length) {
            lastMeasuredItemCount.current = measuredItems.length;
            return;
        }

        if (lastMeasuredItemCount.current === measuredItems.length || !scrollElement?.scrollTop) {
            return;
        }

        const newItemCount = measuredItems.length - lastMeasuredItemCount.current;
        if (newItemCount === 0) {
            return;
        }

        if (lastMeasuredItemCount.current === 0) {
            lastMeasuredItemCount.current = measuredItems.length;
            return;
        }

        const newItems = measuredItems.slice(0, newItemCount);
        const newItemsHeight = _.chain(newItems)
            .map(item => heightCache.current[getItemKey(item)] ?? defaultHeight)
            .sum()
            .value();

        virtualizer.scrollBy(newItemsHeight);

        lastMeasuredItemCount.current = measuredItems.length;
    }, [defaultHeight, getItemKey, measuredItems, scrollElement, virtualizer]);

    return (
        <Root ref={rootRef} style={{ height: totalSize }}>
            {createPortal(
                <MeasureRoot style={{ width }}>
                    {itemsToMeasure.length > 0 && (
                        <Measure bounds onResize={data => handleResize(itemsToMeasure[0], data)}>
                            {({ measureRef }) => <div ref={measureRef}>{children(itemsToMeasure[0])}</div>}
                        </Measure>
                    )}
                </MeasureRoot>,
                document.body,
            )}
            <Content style={{ transform: `translateY(${virtualizedItems[0]?.start ?? 0}px)` }}>
                {virtualizedItems.map(item => (
                    <div key={item.key} data-index={item.index} ref={virtualizer.measureElement}>
                        {children(measuredItems[item.index])}
                    </div>
                ))}
            </Content>
        </Root>
    );
}
