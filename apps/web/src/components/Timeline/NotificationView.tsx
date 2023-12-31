import React from "react";
import reactStringReplace from "react-string-replace";
import { Avatar } from "ui";

import { NotificationItem, TimelinePost } from "services";

import { Box, Typography } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";

import { EmojiText } from "@components/Emoji/Text";
import { TimelineItemView } from "@components/Timeline/Item";

import { AccountLink, ProfileList, Root } from "@components/Timeline/NotificationView.styles";
import { PostContent } from "@components/Timeline/PostContent";

export interface NotificationViewProps {
    notification: NotificationItem;
}

export function NotificationView({ notification }: NotificationViewProps) {
    const [spoilerOpened, setSpoilerOpened] = React.useState(false);
    const handleSpoilerStatusChange = React.useCallback((_: TimelinePost, opened: boolean) => {
        setSpoilerOpened(opened);
    }, []);

    const { users } = notification;
    if (notification.type === "mention") {
        const { post } = notification;

        return (
            <Root>
                <Box flex="1 1 auto">
                    <TimelineItemView
                        standalone
                        item={post}
                        onSpoilerStatusChange={handleSpoilerStatusChange}
                        spoilerOpened={spoilerOpened}
                    />
                </Box>
            </Root>
        );
    }

    let helperText: string | null = null;
    let helperIcon: React.ReactNode = null;
    let helperTextFormat = "%s";
    let post: TimelinePost | null = null;
    if (users.length > 1) {
        helperTextFormat = `%s and ${users.length - 1} others`;
    }

    switch (notification.type) {
        case "follow":
            helperText = `${helperTextFormat} followed you`;
            break;

        case "favourite":
            helperText = `${helperTextFormat} liked your post`;
            post = notification.post;
            helperIcon = (
                <Box color="rgb(249, 24, 128)">
                    <FavoriteRoundedIcon fontSize="small" />
                </Box>
            );
            break;

        case "reblog":
            helperText = `${helperTextFormat} reposted your post`;
            post = notification.post;
            helperIcon = (
                <Box color="rgb(29, 155, 240)">
                    <RepeatRoundedIcon />
                </Box>
            );
            break;

        case "poll":
            helperText = `Voted poll by %s is finished`;
            post = notification.post;
            break;
    }

    const helperTextContent = reactStringReplace(helperText, "%s", (match, index) => (
        <AccountLink key={index} user={users[0]}>
            <EmojiText size="small" instanceUrl={users[0].instanceUrl}>
                {users[0].accountName}
            </EmojiText>
        </AccountLink>
    ));

    return (
        <Root data-testid="notification-view">
            <Box display="flex" alignItems="center">
                {helperIcon && <Box mr={1.5}>{helperIcon}</Box>}
                <ProfileList>
                    {users.map(user => {
                        return <Avatar key={user.accountId} src={user.avatarUrl} size="small" sx={{ mr: 0.5 }} />;
                    })}
                </ProfileList>
            </Box>
            <Box>
                <Typography variant="body1" fontSize="0.875rem">
                    {helperTextContent}
                </Typography>
                {post && (
                    <Box mt={1.5} color="text.secondary">
                        <PostContent
                            item={post}
                            onSpoilerStatusChange={handleSpoilerStatusChange}
                            spoilerOpened={spoilerOpened}
                        />
                    </Box>
                )}
            </Box>
        </Root>
    );
}
