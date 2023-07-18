import _ from "lodash";
import React from "react";
import replace from "react-string-replace";

import { EmojiItem } from "@services/base/instance";
import { MastodonInstance } from "@services/mastodon/instance";
import { MisskeyInstance } from "@services/misskey/instance";

import { Root } from "./EmojiText.styles";

export type EmojiTextSize = "small" | "medium";

export interface EmojiTextProps {
    instanceUrl?: string;
    children: string;
    size?: EmojiTextSize;
}

type EmojiMap = {
    [instanceUrl: string]: {
        [name: string]: EmojiItem;
    };
};

const EMOJI_MAP: EmojiMap = {};

export const EmojiText = React.memo(({ children, instanceUrl, size = "medium" }: EmojiTextProps) => {
    const [, setLoaded] = React.useState(false);
    const instances = React.useMemo<[MastodonInstance | null, MisskeyInstance | null]>(() => {
        if (!instanceUrl) {
            return [null, null];
        }

        return [MastodonInstance.create(instanceUrl), MisskeyInstance.create(instanceUrl)];
    }, [instanceUrl]);

    const emojis = React.useMemo(() => {
        return [...children.matchAll(/:(.+?):/g)].map(([, emoji]) => emoji);
    }, [children]);

    React.useEffect(() => {
        if (emojis.length === 0 || !instanceUrl) {
            return;
        }

        const cachedEmojis = EMOJI_MAP[instanceUrl];
        let shouldInvalidate = !cachedEmojis;
        if (cachedEmojis && !shouldInvalidate) {
            shouldInvalidate =
                _.difference(
                    emojis,
                    Object.values(cachedEmojis).map(emoji => emoji.name),
                ).length > 0;
        }

        if (!shouldInvalidate) {
            setLoaded(true);
            return;
        }

        (async () => {
            for (const instance of instances) {
                if (!instance) {
                    continue;
                }

                try {
                    const data = await instance.getCustomEmojis();
                    EMOJI_MAP[instanceUrl] = _.keyBy(data, "name");
                    setLoaded(true);
                    break;
                } catch {}
            }
        })();
    }, [instances, emojis, instanceUrl]);

    if (emojis.length === 0 || !instanceUrl) {
        return <>{children}</>;
    }

    const content = replace(children, /:(.+?):/g, (match, index) => {
        const emojis = EMOJI_MAP[instanceUrl];
        if (!emojis) {
            return "⬚";
        }

        const emoji = emojis[match];
        if (!emoji) {
            return "⬚";
        }

        // eslint-disable-next-line @next/next/no-img-element
        return <img alt={emoji.name} key={`${match}_${index}`} src={emoji.url} />;
    });

    return <Root size={size}>{content}</Root>;
});

EmojiText.displayName = "EmojiText";
