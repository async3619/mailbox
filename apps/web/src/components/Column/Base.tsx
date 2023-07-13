import React from "react";
import { mergeRefs } from "react-merge-refs";
import Scrollbars from "rc-scrollbars";

import { IconButton } from "ui";

import { LinearProgress, Stack, Typography } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useSortable } from "@dnd-kit/sortable";

import { ColumnSidebarProps } from "@components/Column/Sidebar/Base";
import { ColumnSettingsSidebar } from "@components/Column/Sidebar/Settings/Column";

import { ColumnInstance } from "@components/Column/types";
import { Content, Handle, Header, ProgressWrapper, Root, Title, Wrapper } from "@components/Column/Base.styles";

import { useColumnNodeSetter, useColumns } from "@states/columns";
import { Fn } from "@utils/types";
import { ColumnContext } from "@components/Column/context";

export interface ColumnProps {
    instance: ColumnInstance;
    children: React.ReactNode | Fn<[view: HTMLElement | null], React.ReactNode>;
    loading?: boolean;
    onScroll?: (offset: number) => void;
}

interface SidebarHolder {
    component: React.ComponentType<ColumnSidebarProps> | null;
}

export const BaseColumn = ({ instance, children, loading, onScroll }: ColumnProps) => {
    const { id, title } = instance;
    const [scrollbars, setScrollbars] = React.useState<Scrollbars | null>(null);
    const setColumnNode = useColumnNodeSetter(id);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const { removeColumn } = useColumns();
    const [sidebar, setSidebar] = React.useState<SidebarHolder>({ component: null });

    const handleScroll = React.useCallback(
        (event: React.UIEvent<HTMLElement>) => {
            const { scrollTop } = event.currentTarget;
            onScroll?.(scrollTop);
        },
        [onScroll],
    );

    const handleTitleClick = React.useCallback(() => {
        scrollbars?.scrollToTop();
    }, [scrollbars]);
    const handleColumnDelete = React.useCallback(() => removeColumn(id), [id, removeColumn]);
    const handleSettingsClick = React.useCallback(() => {
        setSidebar(prev => ({ component: prev.component === null ? ColumnSettingsSidebar : null }));
    }, []);

    const ref = React.useMemo(() => mergeRefs([setNodeRef, setColumnNode]), [setNodeRef, setColumnNode]);
    const style = {
        transform: `translate3d(${transform?.x ?? 0}px, ${transform?.y ?? 0}px, 0)`,
        transition,
    };

    let sidebarContent: React.ReactNode;
    if (sidebar.component) {
        const { component: Component } = sidebar;

        sidebarContent = <Component instance={instance} />;
    }

    return (
        <ColumnContext.Provider value={{ column: instance }}>
            <Wrapper style={{ ...style, zIndex: isDragging ? 1000 : 0 }}>
                <Root
                    size={instance.size}
                    ref={ref}
                    style={{
                        borderTopRightRadius: sidebar.component ? "0" : undefined,
                        borderBottomRightRadius: sidebar.component ? "0" : undefined,
                    }}
                >
                    <Header>
                        <Handle {...attributes} {...listeners} />
                        <Title role="button" onClick={handleTitleClick}>
                            <Typography variant="h6" fontSize="1rem" fontWeight={600} lineHeight={1}>
                                {title}
                            </Typography>
                        </Title>
                        <Stack direction="row" spacing={1} className="controls">
                            <IconButton
                                size="small"
                                tooltip="Delete Column"
                                tooltipPlacement="bottom"
                                color="error"
                                onClick={handleColumnDelete}
                            >
                                <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                tooltip="Column Settings"
                                tooltipPlacement="bottom"
                                onClick={handleSettingsClick}
                            >
                                <SettingsRoundedIcon fontSize="small" />
                            </IconButton>
                        </Stack>
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
                {sidebarContent}
            </Wrapper>
        </ColumnContext.Provider>
    );
};

BaseColumn.displayName = "BaseColumn";
