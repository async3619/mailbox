import React from "react";

import { Grid } from "@mui/material";
import { TimelineItem } from "@services/base/timeline";

import { useMedia } from "@components/Media";
import { AttachmentView } from "@components/Timeline/AttachmentView";
import { Root } from "@components/Timeline/AttachmentList.styles";

export interface AttachmentListProps {
    attachments: TimelineItem["attachments"];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
    const media = useMedia();
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
                    <AttachmentView attachment={attachments[0]} onClick={() => handlePreviewClick(0)} />
                </Grid>
            </>
        );
    } else if (attachments.length === 3) {
        content = (
            <>
                <Grid item xs={6}>
                    <AttachmentView
                        attachment={attachments[0]}
                        fullHeight
                        aspectRatio={false}
                        onClick={() => handlePreviewClick(0)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={0.5}>
                        <Grid item xs={12}>
                            <AttachmentView attachment={attachments[1]} onClick={() => handlePreviewClick(2)} />
                        </Grid>
                        <Grid item xs={12}>
                            <AttachmentView attachment={attachments[2]} onClick={() => handlePreviewClick(3)} />
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
