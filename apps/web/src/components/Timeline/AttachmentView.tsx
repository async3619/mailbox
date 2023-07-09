import React from "react";

import { PostItem } from "@services/base/timeline";

import { Item, Root } from "@components/Timeline/AttachmentView.styles";
import { Grid } from "@mui/material";

export interface AttachmentViewProps {
    attachments: PostItem["attachments"];
}

export function AttachmentView({ attachments }: AttachmentViewProps) {
    let content: React.ReactNode;
    if (attachments.length === 1) {
        content = (
            <>
                <Grid item xs={12}>
                    <Item key={attachments[0].url} style={{ backgroundImage: `url(${attachments[0].previewUrl})` }} />
                </Grid>
            </>
        );
    } else if (attachments.length === 3) {
        content = (
            <>
                <Grid item xs={6}>
                    <Item
                        key={attachments[0].url}
                        style={{
                            height: "100%",
                            backgroundImage: `url(${attachments[0].previewUrl})`,
                            aspectRatio: "auto",
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={0.5}>
                        <Grid item xs={12}>
                            <Item
                                key={attachments[1].url}
                                style={{ backgroundImage: `url(${attachments[1].previewUrl})`, aspectRatio: "16 / 9" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Item
                                key={attachments[2].url}
                                style={{ backgroundImage: `url(${attachments[2].previewUrl})`, aspectRatio: "16 / 9" }}
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
                        <Item
                            key={attachment.url}
                            style={{ backgroundImage: `url(${attachment.previewUrl})`, aspectRatio }}
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
