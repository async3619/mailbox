import React from "react";

import { TimelineItem } from "@services/base/timeline";

import { TimelineItem as TimelineItemView } from "@components/Timeline/Item";
import { Root } from "@components/Timeline/index.styles";

export interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    return (
        <Root>
            {items.map(item => (
                <TimelineItemView key={item.id} item={item} />
            ))}
        </Root>
    );
}
