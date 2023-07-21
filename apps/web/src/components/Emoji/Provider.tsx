import React from "react";

import { ApolloClient } from "@apollo/client";
import { queryEmojis } from "@apollo/queries";

import { EmojiContext } from "@components/Emoji/context";

import { CustomEmojiItem } from "@utils/types";

export interface EmojiProviderProps {
    children: React.ReactNode;
    client: ApolloClient<object>;
}

export interface EmojiProviderStates {
    emojiMap: Record<string, CustomEmojiItem[]> | null;
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
        const newEmojiMap: Record<string, CustomEmojiItem[]> = {};
        for (const { instance, emojis: emojiItems } of emojis.data.emojis) {
            newEmojiMap[instance] = emojiItems;
        }

        this.setState({
            emojiMap: newEmojiMap,
            loading: false,
        });
    }

    public render() {
        const { children } = this.props;
        const { loading } = this.state;

        return <EmojiContext.Provider value={{ loading }}>{children}</EmojiContext.Provider>;
    }
}
