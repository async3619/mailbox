import React from "react";
import useMeasure from "react-use-measure";
import { Avatar } from "ui";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { Box, Typography } from "@mui/material";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

import { TimelinePost } from "@services/types";

import { AttachmentList } from "@components/Timeline/AttachmentList";
import { EmojiText } from "@components/EmojiText";
import { ContentRenderer } from "@components/ContentRenderer";

import { Header, Root } from "@components/Timeline/Item.styles";

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
}

export const TimelineItemView = React.memo(({ item, onHeightChange, standalone }: TimelineItemProps) => {
    const [measureRef, { height }] = useMeasure();
    const { content, author, repostedBy, instanceUrl, createdAt, attachments, originPostAuthor } = item;

    React.useEffect(() => {
        if (!height) {
            return;
        }

        onHeightChange?.(height);
    }, [onHeightChange, height]);

    let helperTextIcon: React.ReactNode = null;
    let helperTextContent: string | null = null;
    if (repostedBy) {
        helperTextIcon = <RepeatRoundedIcon fontSize="small" sx={{ mr: 1 }} />;
        helperTextContent = `${repostedBy.accountName} reposted`;
    } else if (originPostAuthor) {
        helperTextIcon = <ReplyRoundedIcon fontSize="small" sx={{ mr: 1 }} />;
        helperTextContent = `replied to ${originPostAuthor.accountName}`;
    }

    return (
        <Root ref={measureRef} withoutPadding={standalone} style={{ border: standalone ? "0" : undefined }}>
            {helperTextContent && helperTextIcon && (
                <Box mb={1.5} display="flex" fontSize="0.8rem" alignItems="center" color="text.secondary">
                    {helperTextIcon}
                    <Typography
                        variant="body2"
                        component="div"
                        fontSize="inherit"
                        color="text.primary"
                        sx={{ opacity: 0.6 }}
                    >
                        <EmojiText instanceUrl={instanceUrl}>{helperTextContent}</EmojiText>
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
                            <EmojiText instanceUrl={instanceUrl}>{author.accountName}</EmojiText>
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
            <Box>
                <ContentRenderer instanceUrl={author.instanceUrl} content={content} />
            </Box>
            {attachments.length > 0 && (
                <Box mt={2}>
                    <AttachmentList post={item} attachments={attachments} />
                </Box>
            )}
        </Root>
    );
});

TimelineItemView.displayName = "TimelineItemView";
