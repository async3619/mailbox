import React from "react";

import { PostContentItem } from "content-parser";
import { Link, Paragraph, Root, Span } from "@components/ContentRenderer.styles";
import { Typography } from "@mui/material";
import { EmojiText } from "@components/EmojiText";

export interface ContentRendererProps {
    content: Array<PostContentItem> | PostContentItem;
    instanceUrl?: string;
}

export function ContentRenderer({ content, instanceUrl }: ContentRendererProps) {
    if (Array.isArray(content)) {
        return (
            <Root>
                {content.map((item, index) => (
                    <ContentRenderer key={index} content={item} instanceUrl={instanceUrl} />
                ))}
            </Root>
        );
    }

    const rawType = content.type;
    if ("children" in content) {
        let component: React.ElementType;
        if (content.type === "paragraph") {
            component = Paragraph;
        } else if (content.type === "span") {
            component = Span;
        } else {
            throw new Error(`Unknown content type: ${rawType}`);
        }

        return (
            <Typography component={component} fontSize="inherit" color="inherit">
                {content.children.map((item, index) => (
                    <ContentRenderer key={index} content={item} instanceUrl={instanceUrl} />
                ))}
            </Typography>
        );
    }

    switch (content.type) {
        case "emoji":
            console.log(instanceUrl, content.code);
            return <EmojiText instanceUrl={instanceUrl}>{`:${content.code}:`}</EmojiText>;

        case "text":
            return <>{content.text}</>;

        case "break-line":
            return <br />;

        case "hash-tag":
            return (
                <Link href={`/u/${content.tag}`} target="_blank" rel="noopener noreferrer">
                    #{content.tag}
                </Link>
            );

        case "mention":
            return (
                <Link href={`/u/${content.instanceUrl}`} target="_blank" rel="noopener noreferrer">
                    {content.accountId}
                </Link>
            );

        case "link":
            return (
                <Link
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    ellipsis={content.content.length > 30}
                >
                    {content.content.slice(0, 30)}
                </Link>
            );

        default:
            throw new Error(`Unknown content type: ${rawType}`);
    }
}
