import React from "react";

import { Switch } from "ui";

import { COLUMN_SIDEBAR_WIDTH } from "@styles/constants";

import { useColumn } from "@components/Column/context";
import { ColumnInstance, ColumnSize } from "@components/Column/types";
import { Content, Header, Root, Wrapper } from "@components/Column/Sidebar.styles";
import { Typography } from "@mui/material";

export interface ColumnSidebarProps {
    open: boolean;
    instance: ColumnInstance;
}

export function ColumnSidebar({ open, instance }: ColumnSidebarProps) {
    const { updateInstance } = useColumn();

    return (
        <Wrapper style={{ maxWidth: open ? `${COLUMN_SIDEBAR_WIDTH}px` : `0px` }}>
            <Root style={{ transform: open ? `translateX(0px)` : undefined }}>
                <Header>
                    <Typography variant="h6" fontSize="0.9rem" fontWeight={800}>
                        Column Settings
                    </Typography>
                </Header>
                <Content>
                    <Switch
                        fullWidth
                        size="small"
                        options={{
                            [ColumnSize.Small]: "Small",
                            [ColumnSize.Medium]: "Medium",
                            [ColumnSize.Large]: "Large",
                        }}
                        value={instance.size}
                        onChange={size => updateInstance(instance.id, { size })}
                    />
                </Content>
            </Root>
        </Wrapper>
    );
}
