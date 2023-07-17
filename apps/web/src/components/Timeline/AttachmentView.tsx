import React from "react";

import { Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

import { TimelinePost } from "@services/types";

import { useColumn } from "@components/Column/context";
import { Label, Play, Root } from "@components/Timeline/AttachmentView.styles";
import { SensitiveBlurring } from "@components/Column/types";

export interface AttachmentViewProps {
    onClick?: () => void;
    post: TimelinePost;
    attachment: TimelinePost["attachments"][0];
    aspectRatio?: string | false;
    fullHeight?: boolean;
}

export function AttachmentView({ post, attachment, aspectRatio, fullHeight = false, onClick }: AttachmentViewProps) {
    const { sensitiveBlurring } = useColumn();
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
            blur={sensitiveBlurring === SensitiveBlurring.WithBlur && post.sensitive}
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
