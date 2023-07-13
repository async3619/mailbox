import React from "react";
import { ColumnInstance } from "@components/Column/types";

export interface ColumnContextValue {
    column: ColumnInstance;
}

export const ColumnContext = React.createContext<ColumnContextValue | null>(null);

export function useColumn() {
    const ctx = React.useContext(ColumnContext);
    if (!ctx) {
        throw new Error("useColumn must be used within a <BaseColumn />");
    }

    return ctx.column;
}
