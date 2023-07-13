import React from "react";

import { Avatar, List, ListItem } from "ui";

import { Box, Typography } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

import { BaseAccount } from "@services/base/account";

import { useColumns } from "@states/columns";

import { MastodonLogo } from "@components/Svg/Mastodon";
import { ColumnSize } from "@components/Column/types";
import { BaseDrawerMenu, BaseDrawerMenuProps } from "@components/DrawerMenu/Base";
import { Header, Root } from "@components/DrawerMenu/AddColumn.styles";

export interface AddColumnDrawerMenuProps extends BaseDrawerMenuProps {
    account: BaseAccount<string>;
}

export function AddColumnDrawerMenu({ account, ...rest }: AddColumnDrawerMenuProps) {
    const { addColumns } = useColumns();
    const handleClick = React.useCallback(
        (title: string) => {
            addColumns({
                type: "timeline",
                title,
                accountId: account.getUniqueId(),
                size: ColumnSize.Small,
                data: {
                    type: "mastodon",
                    timelineType: "home",
                },
            });

            rest.close();
        },
        [account, addColumns, rest],
    );

    const headerContent = (
        <Header>
            <Avatar src={account.getAvatarUrl()} size="medium" sx={{ mr: 1, flex: "0 0 auto" }} />
            <Box>
                <Typography
                    variant="h6"
                    fontSize="1rem"
                    fontWeight={800}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    lineHeight={1}
                    textOverflow="ellipsis"
                    sx={{ mb: 0.5 }}
                >
                    Add Column
                </Typography>
                <Typography variant="body2" fontSize="0.8rem" color="text.secondary">
                    <MastodonLogo fontSize="inherit" /> {account.getDisplayName()}
                </Typography>
            </Box>
        </Header>
    );

    return (
        <BaseDrawerMenu header={headerContent} {...rest}>
            <Root>
                <List>
                    <ListItem
                        startIcon={<HomeRoundedIcon fontSize="small" />}
                        endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                        onClick={() => handleClick("Home")}
                    >
                        Home
                    </ListItem>
                    <ListItem
                        startIcon={<PeopleAltRoundedIcon fontSize="small" />}
                        endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                        onClick={() => handleClick("Local Timeline")}
                    >
                        Local Timeline
                    </ListItem>
                    <ListItem
                        startIcon={<PublicRoundedIcon fontSize="small" />}
                        endIcon={<ChevronRightRoundedIcon fontSize="small" />}
                        onClick={() => handleClick("Federated Timeline")}
                    >
                        Federated Timeline
                    </ListItem>
                </List>
            </Root>
        </BaseDrawerMenu>
    );
}
