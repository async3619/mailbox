import React from "react";
import { mergeRefs } from "react-merge-refs";
import Scrollbars from "rc-scrollbars";

import { IconButton } from "ui";

import { LinearProgress, Typography } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ColumnSidebar } from "@components/Column/Sidebar";
import { ColumnInstance } from "@components/Column/types";
import { Content, Handle, Header, ProgressWrapper, Root, Wrapper } from "@components/Column/Base.styles";

import { useColumnNodeSetter } from "@states/columns";
import { Fn } from "@utils/types";

export interface ColumnProps {
    instance: ColumnInstance;
    children: React.ReactNode | Fn<[view: HTMLElement | null], React.ReactNode>;
    loading?: boolean;
    onScroll?: (offset: number) => void;
}

export const BaseColumn = ({ instance, children, loading, onScroll }: ColumnProps) => {
    const { id, title } = instance;
    const [scrollbars, setScrollbars] = React.useState<Scrollbars | null>(null);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const setColumnNode = useColumnNodeSetter(id);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
    });

    const handleScroll = React.useCallback(
        (event: React.UIEvent<HTMLElement>) => {
            const { scrollTop } = event.currentTarget;
            onScroll?.(scrollTop);
        },
        [onScroll],
    );

    const handleSettingsClick = React.useCallback(() => {
        setSettingsOpen(prev => !prev);
    }, []);

    const ref = React.useMemo(() => {
        return mergeRefs([setNodeRef, setColumnNode]);
    }, [setNodeRef, setColumnNode]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Wrapper style={{ ...style, zIndex: isDragging ? 1000 : 0 }}>
            <Root
                ref={ref}
                style={{
                    borderTopRightRadius: settingsOpen ? "0" : undefined,
                    borderBottomRightRadius: settingsOpen ? "0" : undefined,
                }}
            >
                <Header>
                    <Handle {...attributes} {...listeners} />
                    <Typography variant="h6" fontSize="1rem" fontWeight={600} lineHeight={1} flex="1 1 auto">
                        {title}
                    </Typography>
                    <IconButton
                        size="small"
                        tooltip="Column Settings"
                        tooltipPlacement="bottom"
                        onClick={handleSettingsClick}
                    >
                        <SettingsRoundedIcon fontSize="small" />
                    </IconButton>
                </Header>
                <Content>
                    <ProgressWrapper style={{ opacity: loading ? 1 : 0 }}>
                        <LinearProgress />
                    </ProgressWrapper>
                    <Scrollbars ref={setScrollbars} autoHide onScroll={handleScroll}>
                        {typeof children === "function" && children(scrollbars?.view ?? null)}
                        {typeof children !== "function" && children}
                    </Scrollbars>
                </Content>
            </Root>
            <ColumnSidebar open={settingsOpen} />
        </Wrapper>
    );
};

BaseColumn.displayName = "BaseColumn";
