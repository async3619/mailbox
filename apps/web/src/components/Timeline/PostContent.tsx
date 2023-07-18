import React from "react";

import { Box, Typography } from "@mui/material";

import { TimelinePost } from "@services/types";

import { ContentRenderer } from "@components/ContentRenderer";
import { Root, SpoilerButton } from "@components/Timeline/PostContent.styles";

export interface PostContentProps {
    item: TimelinePost;

    onSpoilerStatusChange: (item: TimelinePost, spoilerOpened: boolean) => void;
    spoilerOpened: boolean;
}

export function PostContent({ item, spoilerOpened, onSpoilerStatusChange }: PostContentProps) {
    const { author, content } = item;

    const handleSpoilerButtonClick = React.useCallback(() => {
        onSpoilerStatusChange(item, !spoilerOpened);
    }, [onSpoilerStatusChange, item, spoilerOpened]);

    let contentBoxHeight: React.CSSProperties["maxHeight"];
    if (item.spoilerText) {
        contentBoxHeight = spoilerOpened ? "none" : "0";
    } else {
        contentBoxHeight = "none";
    }

    return (
        <Root>
            {item.spoilerText && (
                <Box>
                    <Typography fontSize="0.85rem" display="inline-block">
                        {item.spoilerText}
                    </Typography>
                    <SpoilerButton onClick={handleSpoilerButtonClick}>
                        <Typography variant="caption" fontSize="0.85rem" lineHeight={1}>
                            {spoilerOpened ? "Hide" : "Show"}
                        </Typography>
                    </SpoilerButton>
                </Box>
            )}
            <Box overflow="hidden" style={{ maxHeight: contentBoxHeight }}>
                <Box pt={item.spoilerText ? 2 : 0}>
                    <ContentRenderer instanceUrl={author.instanceUrl} content={content} />
                </Box>
            </Box>
        </Root>
    );
}
