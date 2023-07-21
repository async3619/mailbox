import _ from "lodash";
import React from "react";

import { ApolloClient } from "@apollo/client";
import { queryEmojis } from "@apollo/queries";

import { EmojiContext } from "@components/Emoji/context";

import { CustomEmojiItem, Dictionary, Nullable } from "@utils/types";

export interface EmojiProviderProps {
    children: React.ReactNode;
    client: ApolloClient<object>;
}

export interface EmojiProviderStates {
    emojiMap: Dictionary<Dictionary<CustomEmojiItem>> | null;
    loading: boolean;
}

export class EmojiProvider extends React.Component<EmojiProviderProps, EmojiProviderStates> {
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

        const emojis = await queryEmojis(client);
        const newEmojiMap: Dictionary<Dictionary<CustomEmojiItem>> = {};
        for (const { instance, emojis: emojiItems } of emojis.data.emojis) {
            newEmojiMap[instance] = _.chain(emojiItems).keyBy("code").mapValues().value();
        }

        this.setState({
            emojiMap: newEmojiMap,
            loading: false,
        });
    }

    private getEmoji = (instanceUrl: Nullable<string>, code: string) => {
        const { emojiMap, loading } = this.state;
        if (loading || !instanceUrl || !emojiMap) {
            return null;
        }

        const emojis = emojiMap[instanceUrl];
        if (!emojis?.[code]) {
            return null;
        }

        return emojis[code];
    };
    private parseEmojis = (instanceUrl: Nullable<string>, text: string) => {
        const result: Dictionary<Nullable<CustomEmojiItem>> = {};
        const matches = text.matchAll(/:(.+?):/g);
        for (const [, code] of matches) {
            result[code] = this.getEmoji(instanceUrl, code);
        }

        return result;
    };

    public render() {
        const { children } = this.props;
        const { loading } = this.state;

        return (
            <EmojiContext.Provider value={{ loading, getEmoji: this.getEmoji, parseEmojis: this.parseEmojis }}>
                {children}
            </EmojiContext.Provider>
        );
    }
}
