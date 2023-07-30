import React from "react";
import { Switch } from "ui";
import { useTranslation } from "next-i18next";

import { Box, Divider, Stack, Typography } from "@mui/material";

import { useColumns } from "@states/columns";

import { ColumnSize, ImagePreviewSize, SensitiveBlurring } from "@components/Column/types";
import { BaseColumnSidebar, ColumnSidebarProps } from "@components/Column/Sidebar/Base";

import { Root } from "@components/Column/Sidebar/Settings/Column.styles";

export function ColumnSettingsSidebar(props: ColumnSidebarProps) {
    const { instance } = props;
    const { updateColumn } = useColumns();
    const { t } = useTranslation();

    return (
        <BaseColumnSidebar {...props}>
            <Root>
                <Stack spacing={2}>
                    <Box>
                        <Typography gutterBottom variant="body2" fontWeight={600}>
                            {t("columns.settings.size.title")}
                        </Typography>
                        <Switch
                            fullWidth
                            size="small"
                            options={{
                                [ColumnSize.Small]: t("columns.settings.size.small"),
                                [ColumnSize.Medium]: t("columns.settings.size.medium"),
                                [ColumnSize.Large]: t("columns.settings.size.large"),
                            }}
                            value={instance.size}
                            onChange={size => updateColumn(instance.id, { size })}
                        />
                    </Box>
                    <Divider />
                    <Box>
                        <Typography gutterBottom variant="body2" fontWeight={600}>
                            {t("columns.settings.previewRatio.title")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t("columns.settings.previewRatio.description")}
                        </Typography>
                        <Switch
                            fullWidth
                            size="small"
                            options={{
                                [ImagePreviewSize.Rectangle]: t("columns.settings.previewRatio.rectangle"),
                                [ImagePreviewSize.Original]: t("columns.settings.previewRatio.original"),
                            }}
                            value={instance.imagePreviewSize ?? ImagePreviewSize.Rectangle}
                            onChange={size => updateColumn(instance.id, { imagePreviewSize: size })}
                        />
                    </Box>
                    <Divider />
                    <Box>
                        <Typography gutterBottom variant="body2" fontWeight={600}>
                            {t("columns.settings.sensitiveImages.title")}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t("columns.settings.sensitiveImages.description")}
                        </Typography>
                        <Switch
                            fullWidth
                            size="small"
                            options={{
                                [SensitiveBlurring.WithoutBlur]: t("columns.settings.sensitiveImages.show"),
                                [SensitiveBlurring.WithBlur]: t("columns.settings.sensitiveImages.hide"),
                            }}
                            value={instance.sensitiveBlurring ?? SensitiveBlurring.WithBlur}
                            onChange={value => updateColumn(instance.id, { sensitiveBlurring: value })}
                        />
                    </Box>
                </Stack>
            </Root>
        </BaseColumnSidebar>
    );
}
