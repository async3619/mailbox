import React from "react";
import { EmojiContext } from "@components/Emoji/context";
import { CustomEmojiItem, Dictionary } from "@utils/types";

interface MockEmojiProviderProps {
    children: React.ReactNode;
    parse?(instanceUrl: string, text: string): Promise<Dictionary<CustomEmojiItem>>;
}

export function MockEmojiProvider({ parse = jest.fn().mockResolvedValue({}), children }: MockEmojiProviderProps) {
    return <EmojiContext.Provider value={{ loading: false, parse }}>{children}</EmojiContext.Provider>;
}
