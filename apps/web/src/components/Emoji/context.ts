import React from "react";
import { CustomEmojiItem, Dictionary, Nullable } from "@utils/types";

export interface EmojiContextValue {
    loading: boolean;
    getEmoji(instanceUrl: Nullable<string>, emoji: string): Nullable<CustomEmojiItem>;
    parseEmojis(instanceUrl: Nullable<string>, text: string): Dictionary<Nullable<CustomEmojiItem>>;
}

export const EmojiContext = React.createContext<EmojiContextValue | null>(null);

export function useEmojiManager() {
    const context = React.useContext(EmojiContext);
    if (context === null) {
        throw new Error("useEmoji() must be used within an <EmojiProvider />");
    }

    return context;
}
