import React from "react";
import replace from "react-string-replace";

import { Root } from "@components/EmojiText.styles";

export type EmojiTextSize = "small" | "medium";

export interface EmojiTextProps {
    children: string;
    instanceUrl?: string;
    size?: EmojiTextSize;
}

export const EmojiText = React.memo(({ children, instanceUrl, size = "medium" }: EmojiTextProps) => {
    if (!instanceUrl) {
        return <Root size={size}>{children}</Root>;
    }

    const content = replace(children, /:(.+?):/g, (match, index) => {
        return "⬚";
    });

    return <Root size={size}>{content}</Root>;
});

EmojiText.displayName = "EmojiText";
