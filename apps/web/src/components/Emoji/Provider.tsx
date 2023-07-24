import _ from "lodash";
import React from "react";

import { ApolloClient } from "@apollo/client";
import { executeInvalidateEmojis, queryEmojis } from "@apollo/queries";

import { EmojiContext } from "@components/Emoji/context";

import { CustomEmojiItem, Dictionary } from "@utils/types";
import { BatchProcessor } from "@utils/batch";

type EmojiMap = Dictionary<Dictionary<CustomEmojiItem>>;

export interface EmojiProviderProps {
    children: React.ReactNode;
    client: ApolloClient<object>;
}

export interface EmojiProviderStates {
    emojiMap: EmojiMap | null;
    loading: boolean;
}

export class EmojiProvider extends React.Component<EmojiProviderProps, EmojiProviderStates> {
    private readonly emojiInvalidator = new BatchProcessor(this.invalidateEmojis.bind(this), {
        timeout: 1000,
    });

    public state: EmojiProviderStates = {
        emojiMap: null,
        loading: false,
    };

    public async componentDidMount() {
        const { client } = this.props;
        const { emojiMap } = this.state;
        if (emojiMap) {
            return;
        }

        const emojis = await queryEmojis(client, { fetchPolicy: "no-cache" });
        const newEmojiMap: EmojiMap = {};
        for (const { instance, emojis: emojiItems } of emojis.data.emojis) {
            newEmojiMap[instance] = _.chain(emojiItems).keyBy("code").mapValues().value();
        }

        this.setState({
            emojiMap: newEmojiMap,
            loading: false,
        });
    }

    private async invalidateEmojis(instanceUrls: string[]): Promise<EmojiMap> {
        instanceUrls = _.uniq(instanceUrls);
        console.debug("Requesting invalidation of emoji cache of: ", instanceUrls);

        await executeInvalidateEmojis(this.props.client, {
            variables: { instanceUrls },
        });

        const emojis = await queryEmojis(this.props.client, { fetchPolicy: "no-cache" });
        const newEmojiMap: EmojiMap = {};
        for (const { instance, emojis: emojiItems } of emojis.data.emojis) {
            newEmojiMap[instance] = _.chain(emojiItems).keyBy("code").mapValues().value();
        }

        this.setState(prevState => ({
            emojiMap: {
                ...prevState.emojiMap,
                ...newEmojiMap,
            },
        }));

        return {
            ...this.state.emojiMap,
            ...newEmojiMap,
        };
    }

    private parseEmojis = async (
        instanceUrl: string,
        text: string,
        emojiMap?: EmojiMap,
        invalidate = true,
    ): Promise<Dictionary<CustomEmojiItem>> => {
        emojiMap ??= this.state.emojiMap ?? {};

        const result: Dictionary<CustomEmojiItem> = {};
        const matchedItems = [...text.matchAll(/:(.+?):/g)];
        for (const [, code] of matchedItems) {
            const matchedItem = emojiMap?.[instanceUrl]?.[code];
            if (!matchedItem) {
                continue;
            }

            result[code] = matchedItem;
        }

        const codes = matchedItems.map(([, code]) => code);
        if (codes.length <= 0) {
            return result;
        }

        const missingCodes = _.difference(codes, Object.keys(result));
        if (missingCodes.length > 0 && invalidate) {
            const newEmojiMap = await this.emojiInvalidator.call(instanceUrl);

            return this.parseEmojis(instanceUrl, text, newEmojiMap, false);
        }

        return result;
    };

    public render() {
        const { children } = this.props;
        const { loading } = this.state;

        return <EmojiContext.Provider value={{ loading, parse: this.parseEmojis }}>{children}</EmojiContext.Provider>;
    }
}
