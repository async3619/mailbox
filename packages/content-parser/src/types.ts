export interface ParagraphPostContentItem {
    type: "paragraph";
    children: PostContentItem[];
}
export interface SpanPostContentItem {
    type: "span";
    children: PostContentItem[];
}
export interface LinkPostContentItem {
    type: "link";
    url: string;
    content: string;
}
export interface HashTagPostContentItem {
    type: "hash-tag";
    tag: string;
}
export interface MentionPostContentItem {
    type: "mention";
    accountId: string;
    instanceUrl: string;
}
export interface BreakLinePostContentItem {
    type: "break-line";
}
export interface TextPostContentItem {
    type: "text";
    text: string;
}
export interface EmojiPostContentItem {
    type: "emoji";
    code: string;
}

export type PostContentItem =
    | ParagraphPostContentItem
    | SpanPostContentItem
    | HashTagPostContentItem
    | MentionPostContentItem
    | BreakLinePostContentItem
    | TextPostContentItem
    | LinkPostContentItem
    | EmojiPostContentItem;
