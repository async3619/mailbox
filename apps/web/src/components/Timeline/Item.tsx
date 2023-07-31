import React from "react";
import useMeasure from "react-use-measure";
import { Avatar } from "ui";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { Box, Typography } from "@mui/material";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

import { TimelinePost } from "services";

import { AttachmentList } from "@components/Timeline/AttachmentList";
import { TimelineItemReaction } from "@components/Timeline/ItemReaction";
import { EmojiText } from "@components/Emoji/Text";

import { AttachmentWrapper, Header, Root } from "@components/Timeline/Item.styles";
import { PostContent } from "@components/Timeline/PostContent";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "now",
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "1d",
        dd: "%dd",
        M: "1M",
        MM: "%dM",
        y: "1y",
        yy: "%dy",
    },
});

export interface TimelineItemProps {
    item: TimelinePost;
    standalone?: boolean;
    onHeightChange?: (height: number) => void;
    onSpoilerStatusChange: (item: TimelinePost, spoilerOpened: boolean) => void;
    spoilerOpened: boolean;
}

export const TimelineItemView = React.memo(
    ({ item, onHeightChange, standalone, onSpoilerStatusChange, spoilerOpened }: TimelineItemProps) => {
        const [measureRef, { height }] = useMeasure();
        const { author, repostedBy, createdAt, attachments, originPostAuthor } = item;

        React.useEffect(() => {
            if (!height) {
                return;
            }

            onHeightChange?.(height);
        }, [onHeightChange, height]);

        let helperTextIcon: React.ReactNode = null;
        let helperTextContent: string | null = null;
        let helperTextInstanceUrl: string | null = null;
        if (repostedBy) {
            helperTextIcon = <RepeatRoundedIcon fontSize="small" sx={{ mr: 1 }} />;
            helperTextContent = `${repostedBy.accountName} reposted`;
            helperTextInstanceUrl = repostedBy.instanceUrl;
        } else if (originPostAuthor) {
            helperTextIcon = <ReplyRoundedIcon fontSize="small" sx={{ mr: 1 }} />;
            helperTextContent = `replied to ${originPostAuthor.accountName}`;
            helperTextInstanceUrl = originPostAuthor.instanceUrl;
        }

        return (
            <Root
                ref={measureRef}
                withoutPadding={standalone}
                style={{ border: standalone ? "0" : undefined }}
                data-testid="timeline-item-view"
            >
                {helperTextContent && helperTextIcon && helperTextInstanceUrl && (
                    <Box mb={1.5} display="flex" fontSize="0.8rem" alignItems="center" color="text.secondary">
                        {helperTextIcon}
                        <Typography
                            variant="body2"
                            component="div"
                            fontSize="inherit"
                            color="text.primary"
                            sx={{ opacity: 0.6 }}
                        >
                            <EmojiText size="small" instanceUrl={helperTextInstanceUrl}>
                                {helperTextContent}
                            </EmojiText>
                        </Typography>
                    </Box>
                )}
                <Header>
                    <Avatar
                        size="medium"
                        src={author.avatarUrl}
                        secondarySrc={repostedBy?.avatarUrl}
                        sx={{ flex: "0 0 auto" }}
                    />
                    <Box minWidth={0} display="flex" flex="1 1 auto">
                        <Box display="flex" flexDirection="column" flex="1 1 auto" ml={1} minWidth={0}>
                            <Typography
                                variant="body2"
                                component="div"
                                fontWeight={800}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                            >
                                <EmojiText size="small" instanceUrl={author.instanceUrl}>
                                    {author.accountName}
                                </EmojiText>
                            </Typography>
                            <Typography
                                variant="body2"
                                component="div"
                                color="text.secondary"
                                fontSize="0.8rem"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                            >
                                {author.accountId}
                            </Typography>
                        </Box>
                        <Box ml={1}>
                            <Typography
                                variant="body2"
                                component="div"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                color="text.secondary"
                                fontSize="0.8rem"
                            >
                                {createdAt.fromNow(true)}
                            </Typography>
                        </Box>
                    </Box>
                </Header>
                <PostContent item={item} spoilerOpened={spoilerOpened} onSpoilerStatusChange={onSpoilerStatusChange} />
                {attachments.length > 0 && (
                    <AttachmentWrapper>
                        <AttachmentList post={item} attachments={attachments} />
                    </AttachmentWrapper>
                )}
                <TimelineItemReaction post={item} />
            </Root>
        );
    },
);

TimelineItemView.displayName = "TimelineItemView";
