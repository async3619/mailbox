import React from "react";

import { BaseDialogProps } from "ui/dialogs";

type Props<TProps extends BaseDialogProps> = Omit<TProps, keyof BaseDialogProps> extends Record<string, never>
    ? []
    : [Omit<TProps, keyof BaseDialogProps>];

export interface DialogInstance<TProps extends BaseDialogProps> {
    id: string;
    component: React.ComponentType<TProps>;
    props: Omit<TProps, keyof BaseDialogProps>;
    open: boolean;
    onClose: () => void;
    onClosed: () => void;
}

export interface DialogContextValue {
    showDialog<TProps extends BaseDialogProps>(
        component: React.ComponentType<TProps>,
        ...props: Props<TProps>
    ): Promise<void>;

    showBackdrop(): void;
    hideBackdrop(): void;
}

export const DialogContext = React.createContext<DialogContextValue>(null);

export function useDialog() {
    const dialog = React.useContext(DialogContext);
    if (!dialog) {
        throw new Error("useDialog must be used within a DialogProvider");
    }

    return dialog;
}
