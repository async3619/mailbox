import React from "react";
import useMeasure from "react-use-measure";
import { Avatar } from "ui";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { Box, Typography } from "@mui/material";

import { TimelineItem } from "@services/base/timeline";

import { AttachmentList } from "@components/Timeline/AttachmentList";
import { EmojiText } from "@components/EmojiText";

import { Content, Header, Root } from "@components/Timeline/Item.styles";

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
    item: TimelineItem;
    onHeightChange?: (height: number) => void;
}

export const TimelineItemView = React.memo(({ item, onHeightChange }: TimelineItemProps) => {
    const [measureRef, { height }] = useMeasure();
    const { avatarUrl, content, accountName, accountId, instanceUrl, createdAt, attachments } = item;

    React.useEffect(() => {
        if (!height) {
            return;
        }

        onHeightChange?.(height);
    }, [height]);

    return (
        <Root ref={measureRef}>
            <Header>
                <Avatar size="small" src={avatarUrl} sx={{ flex: "0 0 auto" }} />
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
                            <EmojiText instanceUrl={instanceUrl}>{accountName}</EmojiText>
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
                            {accountId}
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
                        >
                            {createdAt.fromNow(true)}
                        </Typography>
                    </Box>
                </Box>
            </Header>
            <Content dangerouslySetInnerHTML={{ __html: content }} />
            {attachments.length > 0 && (
                <Box mt={2}>
                    <AttachmentList attachments={attachments} />
                </Box>
            )}
        </Root>
    );
});

TimelineItemView.displayName = "TimelineItemView";
