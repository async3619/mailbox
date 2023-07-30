import React from "react";
import { List, ListItem } from "ui";
import { useTranslation } from "next-i18next";

import { Divider, Stack } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import { BaseAccount, PostTimelineType, TimelineType } from "services";

import { useColumns } from "@states/columns";

import { ColumnSize, ImagePreviewSize, SensitiveBlurring } from "@components/Column/types";
import { BaseDrawerMenu, BaseDrawerMenuProps } from "@components/DrawerMenu/Base";
import { Root } from "@components/DrawerMenu/MastodonAddColumn.styles";
import { AccountHeader } from "@components/AccountHeader";

export interface AddColumnDrawerMenuProps extends BaseDrawerMenuProps {
    account: BaseAccount<string>;
}

export function MastodonAddColumnDrawerMenu({ account, ...rest }: AddColumnDrawerMenuProps) {
    const { t } = useTranslation("common");
    if (account.getServiceType() !== "mastodon") {
        throw new Error(`Invalid service type: ${account.getServiceType()}`);
    }

    const { addColumns } = useColumns();
    const addTimeline = React.useCallback(
        (title: string, timelineType: PostTimelineType) => {
            addColumns({
                type: "timeline",
                title,
                accountId: account.getUniqueId(),
                size: ColumnSize.Small,
                sensitiveBlurring: SensitiveBlurring.WithBlur,
                imagePreviewSize: ImagePreviewSize.Rectangle,
                timelineType,
            });

            rest.close();
        },
        [account, addColumns, rest],
    );

    const addNotification = React.useCallback(
        (title: string) => {
            addColumns({
                type: "notification",
                title,
                accountId: account.getUniqueId(),
                size: ColumnSize.Small,
                sensitiveBlurring: SensitiveBlurring.WithBlur,
                imagePreviewSize: ImagePreviewSize.Rectangle,
            });

            rest.close();
        },
        [account, addColumns, rest],
    );

    const headerContent = (
        <AccountHeader account={account} titleWeight={800} titleText={t("actions.addColumn.title")} />
    );

    return (
        <BaseDrawerMenu header={headerContent} {...rest}>
            <Root>
                <Stack spacing={1}>
                    <List>
                        <ListItem
                            startIcon={<HomeRoundedIcon fontSize="small" />}
                            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                            onClick={() => addTimeline(t("mastodon.timeline.home"), TimelineType.Home)}
                        >
                            {t("mastodon.timeline.home")}
                        </ListItem>
                        <ListItem
                            startIcon={<PeopleAltRoundedIcon fontSize="small" />}
                            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                            onClick={() => addTimeline(t("mastodon.timeline.local"), TimelineType.Local)}
                        >
                            {t("mastodon.timeline.local")}
                        </ListItem>
                        <ListItem
                            startIcon={<PublicRoundedIcon fontSize="small" />}
                            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                            onClick={() => addTimeline(t("mastodon.timeline.federated"), TimelineType.Federated)}
                        >
                            {t("mastodon.timeline.federated")}
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem
                            startIcon={<NotificationsRoundedIcon fontSize="small" />}
                            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                            onClick={() => addNotification(t("mastodon.notifications"))}
                        >
                            {t("mastodon.notifications")}
                        </ListItem>
                    </List>
                </Stack>
            </Root>
        </BaseDrawerMenu>
    );
}
