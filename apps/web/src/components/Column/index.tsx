import React from "react";

import { TimelineColumn } from "@components/Column/TimelineColumn";
import { ColumnInstance } from "@components/Column/types";

export interface ColumnProps {
    column: ColumnInstance;
}

export function Column({ column }: ColumnProps) {
    if (column.type === "timeline") {
        return <TimelineColumn instance={column} />;
    }

    throw new Error(`Unknown column type: ${column.type}`);
}
