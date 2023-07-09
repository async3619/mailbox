import React from "react";
import { mergeRefs } from "react-merge-refs";

import { Typography } from "@mui/material";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Handle, Header, Root } from "@components/Column/index.styles";
import { useColumnNodeSetter } from "@states/columns";

export interface ColumnProps {
    title: string;
    instanceId: string;
}

export const Column = ({ title, instanceId }: ColumnProps) => {
    const setColumnNode = useColumnNodeSetter(instanceId);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: instanceId,
    });

    const ref = React.useMemo(() => {
        return mergeRefs([setNodeRef, setColumnNode]);
    }, [setNodeRef, setColumnNode]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Root ref={ref} style={{ ...style, zIndex: isDragging ? 1000 : 0 }}>
            <Header>
                <Handle {...attributes} {...listeners} />
                <Typography variant="h6" fontSize="1rem" fontWeight={600} lineHeight={1}>
                    {title}
                </Typography>
            </Header>
        </Root>
    );
};

Column.displayName = "Column";
