import * as React from "react";

import { Dialog, DialogProps } from "@mui/material";

export interface BaseDialogProps extends Omit<DialogProps, "open" | "onClose"> {
    open: boolean;
    onClose: () => void;
    onClosed: () => void;
}

interface Props extends BaseDialogProps {
    children: React.ReactNode;
}

export const BaseDialog = (props: Props) => {
    const { open, onClose, onClosed, children, TransitionProps, ...rest } = props;

    return (
        <Dialog open={open} onClose={onClose} TransitionProps={{ onExited: onClosed, ...TransitionProps }} {...rest}>
            {children}
        </Dialog>
    );
};
