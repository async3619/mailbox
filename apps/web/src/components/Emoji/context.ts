import React from "react";

export interface EmojiContextValue {
    loading: boolean;
}

export const EmojiContext = React.createContext<EmojiContextValue | null>(null);

export function useEmojis() {
    const context = React.useContext(EmojiContext);
    if (context === null) {
        throw new Error("useEmoji() must be used within an <EmojiProvider />");
    }

    return context;
}
