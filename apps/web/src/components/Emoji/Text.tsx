import React from "react";
import replace from "react-string-replace";

import { Root } from "@components/Emoji/Text.styles";
import { useEmojiManager } from "@components/Emoji/context";

import { CustomEmojiItem, Dictionary } from "@utils/types";

export type EmojiTextSize = "small" | "medium";

export interface EmojiTextProps {
    children: string;
    instanceUrl?: string;
    size?: EmojiTextSize;
}

export const EmojiText = React.memo(({ children, instanceUrl, size = "medium" }: EmojiTextProps) => {
    const { parse } = useEmojiManager();
    const loading = React.useRef(false);
    const [loaded, setLoaded] = React.useState(false);
    const [targetEmojis, setTargetEmojis] = React.useState<Dictionary<CustomEmojiItem>>({});

    React.useEffect(() => {
        if (!instanceUrl || loading.current || loaded) {
            return;
        }

        loading.current = true;

        parse(instanceUrl, children).then(result => {
            setLoaded(true);
            setTargetEmojis(result);
            loading.current = false;
        });
    }, [instanceUrl, children, parse, loaded]);

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
