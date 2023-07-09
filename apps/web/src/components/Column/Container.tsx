import React from "react";

import { Stack } from "@mui/material";

import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    PointerSensor,
} from "@dnd-kit/core";
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import { ColumnInstance, useColumnNodes } from "@states/columns";

import { Column } from "@components/Column";
import { useLayout } from "@components/Layout/context";
import { Root } from "@components/Column/Container.styles";

import { getClosestIndex } from "@utils/closest";

export interface ColumnContainerProps {
    columns: ColumnInstance[];
    setColumns: React.Dispatch<React.SetStateAction<ColumnInstance[]>>;
}

export function ColumnContainer({ setColumns, columns }: ColumnContainerProps) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const columnNodes = useColumnNodes();
    const { scroller } = useLayout();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleWheel = React.useCallback(
        (event: WheelEvent) => {
            if (!event.altKey || !rootRef.current || !scroller) {
                return;
            }

            const backwards = event.deltaY < 0;
            const pos = scroller.getScrollLeft();
            const allItems = Object.values(columnNodes);
            const allPositions = allItems.map(node => node.offsetLeft);
            const closestIndex = getClosestIndex(allPositions, pos, backwards);

            scroller.scrollLeft(allPositions[closestIndex]);
        },
        [scroller, columnNodes],
    );

    const handleDragEnd = React.useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;

            if (over && active.id !== over.id) {
                setColumns(items => {
                    const oldIndex = items.findIndex(({ id }) => id === active.id);
                    const newIndex = items.findIndex(({ id }) => id === over.id);

                    return arrayMove(items, oldIndex, newIndex);
                });
            }
        },
        [setColumns],
    );

    React.useEffect(() => {
        document.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            document.removeEventListener("wheel", handleWheel);
        };
    }, [handleWheel]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
        >
            <SortableContext strategy={horizontalListSortingStrategy} items={columns}>
                <Root ref={rootRef}>
                    <Stack direction="row" spacing={1} sx={{ minWidth: "100%", height: "100%" }}>
                        {columns.map(({ id }) => (
                            <Column key={id} title={`Column ${id}`} instanceId={id} />
                        ))}
                    </Stack>
                </Root>
            </SortableContext>
        </DndContext>
    );
}
