import _ from "lodash";

import React from "react";
import { createPortal } from "react-dom";
import Measure, { ContentRect, MeasuredComponentProps } from "react-measure";

import { Root } from "@components/VirtualizedList/Helper.styles";

export interface VirtualizedListHelperProps<T> {
    width: number;
    items: T[];
    measuredItems: T[];
    scrollElement?: HTMLElement | null;

    onInitialItems(items: T[]): void;
    onItemReady(item: T, measuredHeight: number): void;
    onItemRemoved(item: T): void;

    itemRenderer(item: T): React.ReactNode;
    getItemKey(item: T): string;
    getItemHeight(item: T): number;
}

export interface VirtualizedListHelperStates<T> {
    itemsToMeasure: T[];
}

export class VirtualizedListHelper<T> extends React.Component<
    VirtualizedListHelperProps<T>,
    VirtualizedListHelperStates<T>
> {
    public state: VirtualizedListHelperStates<T>;

    constructor(props: VirtualizedListHelperProps<T>) {
        super(props);

        this.state = {
            itemsToMeasure: _.differenceBy(props.items, props.measuredItems, props.getItemKey),
        };
    }

    public componentDidUpdate(prevProps: Readonly<VirtualizedListHelperProps<T>>) {
        if (prevProps.items !== this.props.items) {
            if (prevProps.items.length === 0) {
                this.props.onInitialItems(this.props.items);
            } else {
                this.handleItemsChanged(prevProps.items, this.props.items);
            }
        }
    }

    private handleItemsChanged = (oldItems: T[], newItems: T[]) => {
        const { getItemKey } = this.props;

        const oldItemKeys = oldItems.map(getItemKey);
        const newItemKeys = newItems.map(getItemKey);
        if (_.isEqual(oldItemKeys, newItemKeys)) {
            return;
        }

        const allItemMap = _.chain(oldItems).concat(newItems).uniqBy(getItemKey).keyBy(getItemKey).value();
        const addedItems = _.chain(newItemKeys)
            .difference(oldItemKeys)
            .map(key => allItemMap[key])
            .value();

        if (addedItems.length) {
            this.handleItemsAdded(addedItems);
        }

        const removedItems = _.chain(oldItemKeys)
            .difference(newItemKeys)
            .map(key => allItemMap[key])
            .value();

        if (removedItems.length) {
            this.handleItemsRemoved(removedItems);
        }
    };
    private handleItemsAdded = (addedItems: T[]) => {
        this.setState(prev => ({ ...prev, itemsToMeasure: [...prev.itemsToMeasure, ...addedItems] }));
    };
    private handleItemsRemoved = (removedItems: T[]) => {
        removedItems.forEach(item => {
            this.props.onItemRemoved(item);
        });
    };

    private handleMeasured = ({ bounds }: ContentRect) => {
        if (!bounds?.height) {
            return;
        }

        const { itemsToMeasure } = this.state;
        const targetItem = itemsToMeasure[0];

        this.setState(
            prev => ({
                itemsToMeasure: prev.itemsToMeasure.slice(1),
            }),
            () => {
                this.props.onItemReady(targetItem, bounds.height);
            },
        );
    };

    private renderMeasureTarget = ({ measureRef }: MeasuredComponentProps) => {
        const { itemRenderer } = this.props;
        const { itemsToMeasure } = this.state;

        return <div ref={measureRef}>{itemRenderer(itemsToMeasure[0])}</div>;
    };
    public render() {
        const { width } = this.props;
        const { itemsToMeasure } = this.state;

        return createPortal(
            <Root style={{ width }}>
                {itemsToMeasure.length > 0 && (
                    <Measure bounds onResize={this.handleMeasured}>
                        {this.renderMeasureTarget}
                    </Measure>
                )}
            </Root>,
            document.body,
        );
    }
}
