import React from "react";

import { PostAttachment } from "@services/base/timeline";

import { Root } from "@components/Media/MediaViewerItem.styles";

export interface MediaViewerItemProps {
    attachment: PostAttachment;
    active: boolean;
}

export function MediaViewerItem({ attachment, active }: MediaViewerItemProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null);

    let content: React.ReactNode | null = null;
    if (attachment?.url) {
        if (attachment.type === "image") {
            // eslint-disable-next-line @next/next/no-img-element
            content = <img src={attachment.url} alt={attachment.url} className="media" />;
        } else if (attachment.type === "video" || attachment.type === "gifv") {
            content = (
                <video
                    ref={videoRef}
                    src={attachment.url}
                    role="application"
                    controls={attachment.type !== "gifv"}
                    loop
                    className="media"
                />
            );
        }
    }

    React.useEffect(() => {
        if (!videoRef.current) {
            return;
        }

        if (active) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }, [videoRef, active]);

    return <Root>{content}</Root>;
}
