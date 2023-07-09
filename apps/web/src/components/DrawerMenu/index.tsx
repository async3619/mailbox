import React from "react";
import { BaseDrawerMenuProps } from "@components/DrawerMenu/Base";

export interface DrawerMenuInstance {
    id: string;
    component: DrawerComponent;
    props: Record<string, unknown>;
    open: boolean;
}

type Props<TProps extends BaseDrawerMenuProps> = Omit<TProps, keyof BaseDrawerMenuProps> extends Record<string, never>
    ? []
    : [Omit<TProps, keyof BaseDrawerMenuProps>];

type DrawerComponent<TProps extends BaseDrawerMenuProps = BaseDrawerMenuProps> = React.ComponentType<TProps>;
export interface DrawerMenuContextValue {
    showDrawerMenu<TProps extends BaseDrawerMenuProps>(
        component: DrawerComponent<TProps>,
        ...props: Props<TProps>
    ): void;
}

export const DrawerMenuContext = React.createContext<DrawerMenuContextValue | null>(null);

export function useDrawerMenu() {
    const context = React.useContext(DrawerMenuContext);
    if (!context) {
        throw new Error("useDrawerMenu must be used within a <DrawerMenuProvider />");
    }

    return context;
}
