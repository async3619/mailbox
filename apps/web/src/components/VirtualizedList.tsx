import _ from "lodash";

import React from "react";
import Measure, { ContentRect } from "react-measure";
import { createPortal } from "react-dom";
import useMeasure from "react-use-measure";

import { useVirtualizer } from "@tanstack/react-virtual";

import { IntersectionLoader } from "@components/IntersectionLoader";
import { Content, MeasureRoot, Root } from "@components/VirtualizedList.styles";

export interface VirtualizedListProps<T> {
    items: T[];
    children: (item: T) => React.ReactNode;
    getItemKey: (item: T) => string;
    defaultHeight: number;
    scrollElement?: HTMLElement | null;
    onLoadMore?(lastItem: T): Promise<T[]>;
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
    onLoadMore,
}: VirtualizedListProps<T>) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const heightCache = React.useRef<Record<string, number>>({});
    const [rootRef, { width }] = useMeasure();
    const lastMeasuredItemCount = React.useRef<number>(0);
    const [{ itemsToMeasure, measuredItems }, setItemHolder] = React.useState<MeasureItemHolder<T>>({
        measuredItems: [],
        itemsToMeasure: [],
    });
    const virtualizer = useVirtualizer({
        estimateSize: index =>
            measuredItems[index]
                ? heightCache.current[getItemKey(measuredItems[index])] ?? defaultHeight
                : defaultHeight,
        getScrollElement: () => scrollElement ?? null,
        count: measuredItems.length + (onLoadMore ? 1 : 0),
        getItemKey: index => (measuredItems[index] ? getItemKey(measuredItems[index]) : "loader"),
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

    React.useEffect(() => {
        const oldItems = _.uniqBy([...measuredItems, ...itemsToMeasure], getItemKey);
        if (oldItems.length <= items.length) {
            return;
        }

        const oldItemIds = _.chain(measuredItems)
            .concat(itemsToMeasure)
            .map(getItemKey)
            .uniq()
            .map(id => ({ id }))
            .value();

        const newItemIds = _.chain(items)
            .map(getItemKey)
            .uniq()
            .map(id => ({ id }))
            .value();

        const deletedItemIds = _.chain(oldItemIds).differenceBy(newItemIds, "id").map("id").uniq().keyBy().value();

        setItemHolder(prev => ({
            ...prev,
            measuredItems: prev.measuredItems.filter(item => !(getItemKey(item) in deletedItemIds)),
            itemsToMeasure: prev.itemsToMeasure.filter(item => !(getItemKey(item) in deletedItemIds)),
        }));
    }, [measuredItems, items, itemsToMeasure, getItemKey]);

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
            .filter(item => getItemKey(item) in heightCache.current)
            .map(item => heightCache.current[getItemKey(item)])
            .sum()
            .value();

        virtualizer.scrollBy(newItemsHeight);

        lastMeasuredItemCount.current = measuredItems.length;
    }, [defaultHeight, getItemKey, measuredItems, scrollElement, virtualizer]);

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

    const handleLoadMore = React.useCallback(() => {
        if (!onLoadMore || !measuredItems.length || loading) {
            return;
        }

        setLoading(true);

        onLoadMore(measuredItems[measuredItems.length - 1])
            .then(newItems => {
                setItemHolder(prev => ({ ...prev, measuredItems: [...prev.measuredItems, ...newItems] }));
            })
            .finally(() => setLoading(false));
    }, [onLoadMore, measuredItems, loading]);

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
                {virtualizedItems.map(item => {
                    if (item.index === measuredItems.length) {
                        let children: React.ReactNode = null;
                        if (measuredItems.length > 0) {
                            children = <IntersectionLoader onLoadMore={handleLoadMore} />;
                        }

                        return (
                            <div key={item.key} data-index={item.index} ref={virtualizer.measureElement}>
                                {children}
                            </div>
                        );
                    }

                    return (
                        <div key={item.key} data-index={item.index} ref={virtualizer.measureElement}>
                            {children(measuredItems[item.index])}
                        </div>
                    );
                })}
            </Content>
        </Root>
    );
}
