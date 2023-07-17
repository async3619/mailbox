import React from "react";

import { List, ListItem } from "ui";

import { Divider, Stack } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import { BaseAccount } from "@services/base/account";
import { PostTimelineType, TimelineType } from "@services/types";

import { useColumns } from "@states/columns";
import { ColumnSize, ImagePreviewSize, SensitiveBlurring } from "@components/Column/types";
import { BaseDrawerMenu, BaseDrawerMenuProps } from "@components/DrawerMenu/Base";
import { Root } from "@components/DrawerMenu/MastodonAddColumn.styles";
import { AccountHeader } from "@components/AccountHeader";

export interface AddColumnDrawerMenuProps extends BaseDrawerMenuProps {
    account: BaseAccount<string>;
}

export function MastodonAddColumnDrawerMenu({ account, ...rest }: AddColumnDrawerMenuProps) {
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

    const headerContent = <AccountHeader account={account} titleWeight={800} titleText="Add Column" />;

    return (
        <BaseDrawerMenu header={headerContent} {...rest}>
            <Root>
                <Stack spacing={1}>
                    <List>
                        <ListItem
                            startIcon={<HomeRoundedIcon fontSize="small" />}
                            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                            onClick={() => addTimeline("Home", TimelineType.Home)}
                        >
                            Home
                        </ListItem>
                        <ListItem
                            startIcon={<PeopleAltRoundedIcon fontSize="small" />}
                            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                            onClick={() => addTimeline("Local Timeline", TimelineType.Local)}
                        >
                            Local Timeline
                        </ListItem>
                        <ListItem
                            startIcon={<PublicRoundedIcon fontSize="small" />}
                            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                            onClick={() => addTimeline("Federated Timeline", TimelineType.Federated)}
                        >
                            Federated Timeline
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem
                            startIcon={<NotificationsRoundedIcon fontSize="small" />}
                            endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                            onClick={() => addNotification("Notifications")}
                        >
                            Notifications
                        </ListItem>
                    </List>
                </Stack>
            </Root>
        </BaseDrawerMenu>
    );
}
