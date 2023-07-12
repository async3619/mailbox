import React from "react";

import { PostAttachment } from "@services/base/timeline";

import { Root } from "@components/Media/ViewerItem.styles";

export interface MediaViewerItemProps {
    attachment: PostAttachment;
    active: boolean;
    expanded?: boolean;
}

export function MediaViewerItem({ attachment, active, expanded }: MediaViewerItemProps) {
    const [mediaDOM, setMediaDOM] = React.useState<HTMLImageElement | HTMLVideoElement | null>(null);
    const mediaRef = React.useCallback((node: HTMLImageElement | HTMLVideoElement | null) => {
        setMediaDOM(node);
    }, []);

    const styles: React.CSSProperties | undefined = React.useMemo(() => {
        if (!attachment.width || !attachment.height) {
            return;
        }

        let expandingDimension: "width" | "height";
        if (attachment.width > attachment.height) {
            expandingDimension = "width";
        } else {
            expandingDimension = "height";
        }

        return {
            aspectRatio:
                attachment.width && attachment.height ? `${attachment.width} / ${attachment.height}` : undefined,
            [expandingDimension]: expanded ? "100%" : `${attachment[expandingDimension]}px`,
        };
    }, [attachment, expanded]);

    let content: React.ReactNode | null = null;
    if (attachment?.url) {
        if (attachment.type === "image") {
            // eslint-disable-next-line @next/next/no-img-element
            content = <img ref={mediaRef} src={attachment.url} alt={attachment.url} className="media" style={styles} />;
        } else if (attachment.type === "video" || attachment.type === "gifv") {
            content = (
                <video
                    ref={mediaRef}
                    src={attachment.url}
                    role="application"
                    controls={attachment.type !== "gifv"}
                    loop
                    className="media"
                    style={styles}
                />
            );
        }
    }

    React.useEffect(() => {
        if (!mediaDOM) {
            return;
        }

        if (!(mediaDOM instanceof HTMLVideoElement)) {
            return;
        }

        if (active) {
            mediaDOM.play();
        } else {
            mediaDOM.pause();
        }
    }, [mediaDOM, active]);

    return <Root>{content}</Root>;
}
