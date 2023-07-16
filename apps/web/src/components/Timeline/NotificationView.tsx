import React from "react";
import reactStringReplace from "react-string-replace";
import { Avatar } from "ui";

import { Box, Typography } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";

import { NotificationItem } from "@services/types";

import { EmojiText } from "@components/EmojiText";
import { TimelineItemView } from "@components/Timeline/Item";

import { AccountLink, Content, ProfileList, Root } from "@components/Timeline/NotificationView.styles";

export interface NotificationViewProps {
    notification: NotificationItem;
}

export function NotificationView({ notification }: NotificationViewProps) {
    const { user } = notification;
    if (notification.type === "mention") {
        const { post } = notification;

        return (
            <Root>
                <Box flex="1 1 auto">
                    <TimelineItemView standalone item={post} />
                </Box>
            </Root>
        );
    }

    let helperText: string | null = null;
    let helperContent: string | null = null;
    let helperIcon: React.ReactNode = null;

    switch (notification.type) {
        case "follow":
            helperText = `%s followed you`;
            break;

        case "favourite":
            helperText = `%s liked your post`;
            helperContent = notification.post?.content ?? null;
            helperIcon = (
                <Box color="rgb(249, 24, 128)">
                    <FavoriteRoundedIcon fontSize="small" />
                </Box>
            );
            break;

        case "reblog":
            helperText = `%s reposted your post`;
            helperContent = notification.post?.content ?? null;
            helperIcon = (
                <Box color="rgb(29, 155, 240)">
                    <RepeatRoundedIcon />
                </Box>
            );
            break;

        case "poll":
            helperText = `Voted poll by %s is finished`;
            helperContent = notification.post?.content ?? null;
            break;
    }

    const helperTextContent = reactStringReplace(helperText, "%s", () => (
        <AccountLink user={user}>
            <EmojiText instanceUrl={user.instanceUrl}>{user.accountName}</EmojiText>
        </AccountLink>
    ));

    return (
        <Root>
            <Box display="flex" alignItems="center">
                {helperIcon && <Box mr={1.5}>{helperIcon}</Box>}
                <ProfileList>
                    <Avatar src={user.avatarUrl} size="small" />
                </ProfileList>
            </Box>
            <Box>
                <Typography variant="body1" fontSize="0.875rem">
                    {helperTextContent}
                </Typography>
                {helperContent && (
                    <Typography
                        component={Content}
                        variant="body2"
                        fontSize="0.85rem"
                        color="text.secondary"
                        dangerouslySetInnerHTML={{ __html: helperContent }}
                    />
                )}
            </Box>
        </Root>
    );
}
