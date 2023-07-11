import React from "react";

import { Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { TimelineItem } from "@services/base/timeline";

import { Label, Play, Root } from "@components/Timeline/AttachmentView.styles";

export interface AttachmentViewProps {
    onClick?: () => void;
    attachment: TimelineItem["attachments"][0];
    aspectRatio?: string | false;
    fullHeight?: boolean;
}

export function AttachmentView({ attachment, aspectRatio, fullHeight = false, onClick }: AttachmentViewProps) {
    const previewUrl = attachment.previewUrl;
    let children: React.ReactNode = null;

    if (attachment.type === "gifv" && attachment.url) {
        children = (
            <>
                <video src={attachment.url} role="application" autoPlay loop />
                <Typography variant="caption" component={Label}>
                    GIF
                </Typography>
            </>
        );
    } else if (attachment.type === "video" && attachment.url) {
        children = (
            <>
                <Play>
                    <PlayArrowRoundedIcon fontSize="inherit" />
                </Play>
            </>
        );
    }

    return (
        <Root
            onClick={onClick}
            style={{
                backgroundImage: `url(${previewUrl})`,
                aspectRatio: aspectRatio === false ? "auto" : aspectRatio,
                height: fullHeight ? "100%" : undefined,
            }}
        >
            {children}
        </Root>
    );
}
