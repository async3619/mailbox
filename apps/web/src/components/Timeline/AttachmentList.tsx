import React from "react";

import { Grid } from "@mui/material";
import { TimelinePost } from "@services/types";

import { useMedia } from "@components/Media";
import { AttachmentView } from "@components/Timeline/AttachmentView";
import { ImagePreviewSize } from "@components/Column/types";
import { useColumn } from "@components/Column/context";
import { Root } from "@components/Timeline/AttachmentList.styles";

export interface AttachmentListProps {
    post: TimelinePost;
    attachments: TimelinePost["attachments"];
}

export function AttachmentList({ post, attachments }: AttachmentListProps) {
    const media = useMedia();
    const { imagePreviewSize = ImagePreviewSize.Rectangle } = useColumn();
    const handlePreviewClick = React.useCallback(
        (index: number) => {
            media.openMediaViewer(attachments, index);
        },
        [attachments, media],
    );

    let content: React.ReactNode;
    if (attachments.length === 1) {
        content = (
            <>
                <Grid item xs={12}>
                    <AttachmentView
                        post={post}
                        attachment={attachments[0]}
                        onClick={() => handlePreviewClick(0)}
                        aspectRatio={
                            imagePreviewSize === ImagePreviewSize.Original
                                ? `${attachments[0].width} / ${attachments[0].height}`
                                : undefined
                        }
                    />
                </Grid>
            </>
        );
    } else if (attachments.length === 3) {
        content = (
            <>
                <Grid item xs={6}>
                    <AttachmentView
                        post={post}
                        attachment={attachments[0]}
                        fullHeight
                        aspectRatio={false}
                        onClick={() => handlePreviewClick(0)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={0.5}>
                        <Grid item xs={12}>
                            <AttachmentView
                                post={post}
                                attachment={attachments[1]}
                                onClick={() => handlePreviewClick(2)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <AttachmentView
                                post={post}
                                attachment={attachments[2]}
                                onClick={() => handlePreviewClick(3)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </>
        );
    } else {
        const targetAttachments = attachments.slice(0, 4);
        const aspectRatio = attachments.length === 2 ? "1 / 1" : undefined;

        content = (
            <>
                {targetAttachments.map((attachment, index) => (
                    <Grid item xs={6} key={+index}>
                        <AttachmentView
                            post={post}
                            key={attachment.url}
                            attachment={attachment}
                            aspectRatio={aspectRatio}
                            onClick={() => handlePreviewClick(index)}
                        />
                    </Grid>
                ))}
            </>
        );
    }

    return (
        <Root>
            <Grid container spacing={0.5}>
                {content}
            </Grid>
        </Root>
    );
}
