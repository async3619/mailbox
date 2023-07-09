import React from "react";

import { PostItem } from "@services/base/timeline";

import { TimelineItem } from "@components/Timeline/Item";
import { Root } from "@components/Timeline/index.styles";

export interface TimelineProps {
    items: PostItem[];
}

export function Timeline({ items }: TimelineProps) {
    return (
        <Root>
            {items.map(item => (
                <TimelineItem key={item.id} item={item} />
            ))}
        </Root>
    );
}
