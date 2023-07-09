export interface EmojiItem {
    name: string;
    url: string;
}

export abstract class BaseInstance {
    public abstract getCustomEmojis(): Promise<EmojiItem[]>;
}
