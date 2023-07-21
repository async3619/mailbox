import React from "react";
import replace from "react-string-replace";

import { Root } from "@components/Emoji/Text.styles";
import { useEmojiManager } from "@components/Emoji/context";

import { CustomEmojiItem, Dictionary, Nullable } from "@utils/types";

export type EmojiTextSize = "small" | "medium";

export interface EmojiTextProps {
    children: string;
    instanceUrl?: string;
    size?: EmojiTextSize;
}

export const EmojiText = React.memo(({ children, instanceUrl, size = "medium" }: EmojiTextProps) => {
    const emojiManager = useEmojiManager();
    const [targetEmojis, setTargetEmojis] = React.useState<Dictionary<Nullable<CustomEmojiItem>>>({});

    React.useEffect(() => {
        if (!instanceUrl || !emojiManager || emojiManager.loading) {
            return;
        }

        setTargetEmojis(emojiManager.parseEmojis(instanceUrl, children));
    }, [instanceUrl, emojiManager, children]);

    if (!instanceUrl) {
        return <Root size={size}>{children}</Root>;
    }

    const content = replace(children, /:(.+?):/g, (match, index) => {
        const targetEmoji = targetEmojis[match];
        if (!targetEmoji) {
            return "⬚";
        }

        // eslint-disable-next-line @next/next/no-img-element
        return <img key={index} src={targetEmoji.url} alt={targetEmoji.code} title={targetEmoji.code} />;
    });

    // eslint-disable-next-line react/no-children-prop
    return <Root size={size} children={content} />;
});

EmojiText.displayName = "EmojiText";
