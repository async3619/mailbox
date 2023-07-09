import React from "react";
import { Scrollbars } from "rc-scrollbars";

export interface LayoutContextValue {
    scroller: Scrollbars | null;
}

export const LayoutContext = React.createContext<LayoutContextValue | null>(null);

export function useLayout() {
    const layout = React.useContext(LayoutContext);
    if (!layout) {
        throw new Error("useLayout must be used within a LayoutProvider");
    }

    return layout;
}
