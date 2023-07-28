import React from "react";

import { Box, Typography } from "@mui/material";

import { TimelinePost } from "services";

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

    let shouldShowContent: boolean;
    if (item.spoilerText) {
        shouldShowContent = spoilerOpened;
    } else {
        shouldShowContent = true;
    }

    return (
        <Root>
            {item.spoilerText && (
                <Box>
                    <Typography fontSize="0.85rem" display="inline-block">
                        {item.spoilerText}
                    </Typography>
                    <SpoilerButton onClick={handleSpoilerButtonClick} data-testid="spoiler-button">
                        <Typography variant="caption" fontSize="0.85rem" lineHeight={1}>
                            {spoilerOpened ? "Hide" : "Show"}
                        </Typography>
                    </SpoilerButton>
                </Box>
            )}
            {shouldShowContent && (
                <Box data-testid="content-wrapper">
                    <Box pt={item.spoilerText ? 2 : 0}>
                        <ContentRenderer instanceUrl={author.instanceUrl} content={content} />
                    </Box>
                </Box>
            )}
        </Root>
    );
}
