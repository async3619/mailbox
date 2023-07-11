import React from "react";

import { MediaContext } from "@components/Media";

import { PostAttachment } from "@services/base/timeline";
import { MediaViewer } from "@components/Media/Viewer";

interface AttachmentStatus {
    attachments: PostAttachment[];
    index: number;
}

export function MediaProvider({ children }: React.PropsWithChildren) {
    const [opened, setOpened] = React.useState(false);
    const [{ attachments, index }, setAttachmentStatus] = React.useState<AttachmentStatus>({
        attachments: [],
        index: 0,
    });

    const openMediaViewer = React.useCallback((attachments: PostAttachment[], index = 0) => {
        setAttachmentStatus({ attachments, index });
        setOpened(true);
    }, []);
    const closeMediaViewer = React.useCallback(() => {
        setOpened(false);
    }, []);

    const clearAttachments = React.useCallback(() => {
        setAttachmentStatus({ attachments: [], index: 0 });
    }, []);

    const handleIndexChange = React.useCallback((index: number) => {
        setAttachmentStatus(prev => ({ ...prev, index }));
    }, []);

    return (
        <MediaContext.Provider
            value={{
                openMediaViewer,
                closeMediaViewer,
            }}
        >
            {children}
            <MediaViewer
                open={opened}
                attachments={attachments}
                onClose={closeMediaViewer}
                onClosed={clearAttachments}
                index={index}
                onIndexChange={handleIndexChange}
            />
        </MediaContext.Provider>
    );
}
