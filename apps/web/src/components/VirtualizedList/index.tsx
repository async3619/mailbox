import React from "react";
import useMeasure from "react-use-measure";

import { useVirtualizer } from "@tanstack/react-virtual";

import { IntersectionLoader } from "@components/IntersectionLoader";

import { Content, Root } from "@components/VirtualizedList/index.styles";
import { VirtualizedListHelper } from "@components/VirtualizedList/Helper";
import _ from "lodash";

export interface VirtualizedListProps<T> {
    items: T[];
    children: (item: T) => React.ReactNode;
    getItemKey: (item: T) => string;
    defaultHeight: number;
    scrollElement?: HTMLElement | null;
    onLoadMore?(lastItemId: string): Promise<T[]>;
}

export function VirtualizedList<T>({
    items: outerItems,
    defaultHeight,
    scrollElement,
    getItemKey,
    children,
    onLoadMore,
}: VirtualizedListProps<T>) {
    const [items, setItems] = React.useState<T[]>(outerItems);
    const [addedHeights, setAddedHeights] = React.useState<number[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const heightCache = React.useRef<Record<string, number>>({});
    const [rootRef, { width }] = useMeasure();
    const virtualizer = useVirtualizer({
        estimateSize: index => {
            if (index === items.length) {
                return 0;
            }

            return heightCache.current[getItemKey(items[index])] || defaultHeight;
        },
        getScrollElement: () => scrollElement ?? null,
        count: items.length + (onLoadMore ? 1 : 0),
        getItemKey: index => (items[index] ? getItemKey(items[index]) : "loader"),
    });
    const virtualizerRef = React.useRef(virtualizer);

    const virtualizedItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    React.useEffect(() => {
        virtualizerRef.current = virtualizer;
    }, [virtualizer]);

    const getItemHeight = React.useCallback(
        (item: T) => {
            const id = getItemKey(item);
            return heightCache.current[id] || defaultHeight;
        },
        [defaultHeight, getItemKey],
    );

    const handleItemReady = React.useCallback(
        (item: T, measuredHeight: number) => {
            const id = getItemKey(item);
            heightCache.current[id] = measuredHeight;

            setItems(prevItems => [item, ...prevItems]);
            if (scrollElement?.scrollTop) {
                setAddedHeights(prevHeights => [measuredHeight, ...prevHeights]);
            }
        },
        [getItemKey, scrollElement],
    );
    const handleItemRemoved = React.useCallback(
        (item: T) => {
            const id = getItemKey(item);
            const height = heightCache.current[id];

            delete heightCache.current[id];

            setItems(prevItems => prevItems.filter(prevItem => getItemKey(prevItem) !== id));
            if (height && scrollElement?.scrollTop) {
                setAddedHeights(prevHeights => [-height, ...prevHeights]);
            }
        },
        [getItemKey, scrollElement],
    );

    const handleLoadMore = React.useCallback(async () => {
        if (!onLoadMore || loading) {
            return;
        }

        setLoading(true);

        const lastItem = items[items.length - 1];
        const newItems = await onLoadMore(getItemKey(lastItem));

        setLoading(false);
        setItems(prevItems => [...prevItems, ...newItems]);
    }, [items, loading, onLoadMore, getItemKey]);

    React.useLayoutEffect(() => {
        if (!scrollElement?.scrollTop) {
            return;
        }

        const addedHeightSum = _.sum(addedHeights);
        if (addedHeightSum === 0) {
            return;
        }

        scrollElement?.scrollBy(0, Math.round(addedHeightSum));
        setAddedHeights([]);
    }, [addedHeights, scrollElement]);

    return (
        <Root data-testid="virtualized-list" ref={rootRef} style={{ height: totalSize }}>
            <VirtualizedListHelper
                width={width}
                items={outerItems}
                measuredItems={items}
                scrollElement={scrollElement}
                onInitialItems={setItems}
                onItemReady={handleItemReady}
                onItemRemoved={handleItemRemoved}
                itemRenderer={children}
                getItemKey={getItemKey}
                getItemHeight={getItemHeight}
            />
            <Content style={{ transform: `translateY(${virtualizedItems[0]?.start ?? 0}px)` }}>
                {virtualizedItems.map(item => {
                    if (item.index === items.length) {
                        let children: React.ReactNode = null;
                        if (items.length > 0) {
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
                            {children(items[item.index])}
                        </div>
                    );
                })}
            </Content>
        </Root>
    );
}
