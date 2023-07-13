import React from "react";
import { Switch } from "ui";

import { Box, Divider, Stack, Typography } from "@mui/material";
import { COLUMN_SIDEBAR_WIDTH } from "@styles/constants";

import { useColumns } from "@states/columns";

import { ColumnInstance, ColumnSize } from "@components/Column/types";
import { Content, Header, Root, Wrapper } from "@components/Column/Sidebar.styles";

export interface ColumnSidebarProps {
    open: boolean;
    instance: ColumnInstance;
}

export function ColumnSidebar({ open, instance }: ColumnSidebarProps) {
    const { updateColumn } = useColumns();

    return (
        <Wrapper style={{ maxWidth: open ? `${COLUMN_SIDEBAR_WIDTH}px` : `0px` }}>
            <Root style={{ transform: open ? `translateX(0px)` : undefined }}>
                <Header>
                    <Typography variant="h6" fontSize="0.9rem" fontWeight={800}>
                        Column Settings
                    </Typography>
                </Header>
                <Content>
                    <Stack spacing={2}>
                        <Box>
                            <Typography gutterBottom variant="body1" fontSize="0.9rem" fontWeight={600}>
                                Column Width
                            </Typography>
                            <Switch
                                fullWidth
                                size="small"
                                options={{
                                    [ColumnSize.Small]: "Small",
                                    [ColumnSize.Medium]: "Medium",
                                    [ColumnSize.Large]: "Large",
                                }}
                                value={instance.size}
                                onChange={size => updateColumn(instance.id, { size })}
                            />
                        </Box>
                        <Divider />
                    </Stack>
                </Content>
            </Root>
        </Wrapper>
    );
}
