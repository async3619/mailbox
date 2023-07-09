import React from "react";
import { mergeRefs } from "react-merge-refs";
import Scrollbars from "rc-scrollbars";

import { LinearProgress, Typography } from "@mui/material";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ColumnInstance } from "@components/Column/types";
import { Body, Content, Handle, Header, ProgressWrapper, Root } from "@components/Column/Base.styles";

import { useColumnNodeSetter } from "@states/columns";

export interface ColumnProps {
    instance: ColumnInstance;
    children: React.ReactNode;
    loading?: boolean;
}

export const BaseColumn = ({ instance, children, loading }: ColumnProps) => {
    const { id, title } = instance;
    const setColumnNode = useColumnNodeSetter(id);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
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
            <Content>
                <ProgressWrapper style={{ opacity: loading ? 1 : 0 }}>
                    <LinearProgress />
                </ProgressWrapper>
                <Scrollbars autoHide>
                    <Body>{children}</Body>
                </Scrollbars>
            </Content>
        </Root>
    );
};

BaseColumn.displayName = "BaseColumn";
