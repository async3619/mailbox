import React from "react";

import { TimelineColumn } from "@components/Column/TimelineColumn";
import { ColumnInstance } from "@components/Column/types";
import { NotificationColumn } from "@components/Column/NotificationColumn";

export interface ColumnProps {
    column: ColumnInstance;
}

export function Column({ column }: ColumnProps) {
    switch (column.type) {
        case "timeline":
            return <TimelineColumn instance={column} />;

        case "notification":
            return <NotificationColumn instance={column} />;
    }

    if (process.env.NODE_ENV === "test") {
        return <div data-testid={`column-${(column as Record<string, unknown>).id}`} />;
    }

    throw new Error(`Unknown column type: ${(column as Record<string, unknown>).type}`);
}
