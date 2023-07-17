import React from "react";
import { mergeRefs } from "react-merge-refs";
import Scrollbars from "rc-scrollbars";

import { Avatar, IconButton } from "ui";

import { Box, LinearProgress, Stack, SvgIconProps, Typography } from "@mui/material";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useSortable } from "@dnd-kit/sortable";

import { ColumnSidebarProps } from "@components/Column/Sidebar/Base";
import { ColumnSettingsSidebar } from "@components/Column/Sidebar/Settings/Column";
import { ColumnContext } from "@components/Column/context";
import { ColumnInstance } from "@components/Column/types";
import { MastodonLogo } from "@components/Svg/Mastodon";
import { Content, Handle, Header, ProgressWrapper, Root, Title, Wrapper } from "@components/Column/Base.styles";

import { BaseAccount } from "@services/base/account";

import { useColumnNodeSetter, useColumns } from "@states/columns";
import { Fn } from "@utils/types";

export interface ColumnProps {
    instance: ColumnInstance;
    children: React.ReactNode | Fn<[view: HTMLElement | null], React.ReactNode>;
    loading?: boolean;
    onScroll?: (offset: number) => void;
    account?: BaseAccount<string>;
}

interface SidebarHolder {
    component: React.ComponentType<ColumnSidebarProps> | null;
}

const SERVICE_TYPE_TO_ICON: Record<string, React.ComponentType<SvgIconProps>> = {
    mastodon: MastodonLogo,
};

export const BaseColumn = ({ instance, children, loading, onScroll, account }: ColumnProps) => {
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

    let headerLogo: React.ReactNode | null = null;
    if (account) {
        const serviceType = account.getServiceType();
        const ServiceIcon = SERVICE_TYPE_TO_ICON[serviceType];
        if (ServiceIcon) {
            headerLogo = <ServiceIcon fontSize="inherit" />;
        }
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
                            {account && (
                                <Box mr={1}>
                                    <Avatar size="small" src={account.getAvatarUrl()} />
                                </Box>
                            )}
                            <Box display="flex" flexDirection="column" justifyContent="center">
                                <Typography
                                    variant="h6"
                                    fontSize="0.95rem"
                                    fontWeight={600}
                                    whiteSpace="nowrap"
                                    overflow="hidden"
                                    lineHeight={1}
                                    textOverflow="ellipsis"
                                    sx={{ mb: account ? 0.5 : 0 }}
                                >
                                    {title}
                                </Typography>
                                {account && (
                                    <Typography variant="body2" fontSize="0.8rem" color="text.secondary">
                                        {headerLogo} {account.getDisplayName()}
                                    </Typography>
                                )}
                            </Box>
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
