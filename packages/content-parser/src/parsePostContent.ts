import { PostContentItem } from "./types";

function parseNode(node: Node): PostContentItem | Array<PostContentItem> {
    if (node.nodeType === Node.TEXT_NODE) {
        const { textContent } = node;
        if (!textContent) {
            throw new Error("Text node has no content.");
        }

        const emojis = [...textContent.matchAll(/:([a-zA-Z0-9_]+):/g)];
        if (emojis.length > 0) {
            const result: PostContentItem[] = [];
            let content = textContent;
            for (const emoji of emojis) {
                const startIndex = content.indexOf(emoji[0]);
                const endIndex = startIndex + emoji[0].length;
                const preContent = content.slice(0, startIndex);
                if (preContent.length > 0) {
                    result.push({ type: "text", text: preContent });
                }

                result.push({ type: "emoji", code: emoji[1] });

                content = content.slice(endIndex);
            }

            if (content.length > 0) {
                result.push({ type: "text", text: content });
            }

            return result;
        } else {
            return { type: "text", text: textContent };
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const childNodes = [...element.childNodes];

        if (element.tagName === "P") {
            return { type: "paragraph", children: childNodes.map(parseNode).flat() };
        }

        if (element.tagName === "SPAN") {
            return { type: "span", children: childNodes.map(parseNode).flat() };
        }

        if (element.tagName === "BR") {
            return { type: "break-line" };
        }

        if (element.tagName === "A") {
            const { textContent, classList } = element;

            if (classList.contains("mention") && !classList.contains("hashtag")) {
                const href = element.getAttribute("href");
                if (!href) {
                    throw new Error("Invalid mention link: href is empty.");
                }

                const url = new URL(href);
                const accountId = url.pathname.slice(1);
                const instanceUrl = url.hostname;

                return { type: "mention", accountId, instanceUrl };
            }

            if (textContent?.trim()?.startsWith("#")) {
                const tag = textContent.trim().slice(1);

                return { type: "hash-tag", tag };
            }

            const href = element.getAttribute("href");
            if (!href) {
                throw new Error("Invalid link: href is empty.");
            }

            return { type: "link", url: href, content: textContent ?? "" };
        }

        throw new Error(`Unknown element tag: ${element.tagName}`);
    } else {
        throw new Error(`Unknown node type: ${node.nodeType}`);
    }
}

export function parsePostContent(rawHtml: string): PostContentItem[] {
    const parser = new DOMParser();
    const document = parser.parseFromString(rawHtml, "text/html");
    const nodes = [...document.body.childNodes];

    return nodes.map(parseNode).flat();
}
