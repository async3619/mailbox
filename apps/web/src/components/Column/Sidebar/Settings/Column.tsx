import React from "react";
import { Switch } from "ui";

import { Box, Divider, Stack, Typography } from "@mui/material";

import { useColumns } from "@states/columns";

import { ColumnSize, ImagePreviewSize } from "@components/Column/types";
import { BaseColumnSidebar, ColumnSidebarProps } from "@components/Column/Sidebar/Base";

import { Root } from "@components/Column/Sidebar/Settings/Column.styles";

export function ColumnSettingsSidebar(props: ColumnSidebarProps) {
    const { instance } = props;
    const { updateColumn } = useColumns();

    return (
        <BaseColumnSidebar {...props}>
            <Root>
                <Stack spacing={2}>
                    <Box>
                        <Typography gutterBottom variant="body2" fontWeight={600}>
                            Column Size
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
                    <Box>
                        <Typography gutterBottom variant="body2" fontWeight={600}>
                            Image Preview Ratio
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            You can change the aspect ratio of the image preview of posts in this column.
                        </Typography>
                        <Switch
                            fullWidth
                            size="small"
                            options={{
                                [ImagePreviewSize.Rectangle]: "16:9",
                                [ImagePreviewSize.Original]: "Original",
                            }}
                            value={instance.imagePreviewSize ?? ImagePreviewSize.Rectangle}
                            onChange={size => updateColumn(instance.id, { imagePreviewSize: size })}
                        />
                    </Box>
                </Stack>
            </Root>
        </BaseColumnSidebar>
    );
}
