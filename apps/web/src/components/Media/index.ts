import React from "react";

import { PostAttachment } from "@services/base/timeline";

interface MediaContextValues {
    openMediaViewer(attachments: PostAttachment[], index?: number): void;
    closeMediaViewer(): void;
}

export const MediaContext = React.createContext<MediaContextValues | null>(null);

export function useMedia() {
    const context = React.useContext(MediaContext);
    if (!context) {
        throw new Error("useMediaContext must be used within a <MediaProvider />");
    }

    return context;
}
