import React from "react";
import { ColumnInstance } from "@components/Column/types";

export interface ColumnContextValue {
    updateInstance: (id: string, instance: Partial<ColumnInstance>) => void;
}

export const ColumnContext = React.createContext<ColumnContextValue | null>(null);

export function useColumn() {
    const context = React.useContext(ColumnContext);
    if (!context) {
        throw new Error("useColumn must be used within a <ColumnContainer />");
    }

    return context;
}
