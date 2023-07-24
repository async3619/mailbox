import React from "react";
import { CustomEmojiItem, Dictionary } from "@utils/types";

export interface EmojiContextValue {
    loading: boolean;
    parse(instanceUrl: string, text: string): Promise<Dictionary<CustomEmojiItem>>;
}

export const EmojiContext = React.createContext<EmojiContextValue | null>(null);

export function useEmojiManager() {
    const context = React.useContext(EmojiContext);
    if (context === null) {
        throw new Error("useEmoji() must be used within an <EmojiProvider />");
    }

    return context;
}
