import React from "react";
import shortid from "shortid";
import { BaseDialogProps } from "ui/dialogs";

import { Backdrop, CircularProgress } from "@mui/material";

import { DialogContext, DialogContextValue, DialogInstance } from "@components/Dialog";

import { Fn } from "@utils/types";

interface DialogProviderStates {
    instances: DialogInstance<BaseDialogProps>[];
    backdrop: boolean;
}

export class DialogProvider extends React.Component<React.PropsWithChildren, DialogProviderStates> {
    public state: DialogProviderStates = {
        instances: [],
        backdrop: false,
    };

    private handleClose = (id: string, resolveFn: Fn<void, void>) => {
        this.setState(({ instances }) => ({
            instances: instances.map(instance => (instance.id === id ? { ...instance, open: false } : instance)),
        }));

        resolveFn();
    };
    private handleClosed = (id: string) => {
        this.setState(({ instances }) => ({
            instances: instances.filter(instance => instance.id !== id),
        }));
    };

    private showDialog: DialogContextValue["showDialog"] = (component, props?: Record<string, unknown>) => {
        return new Promise<void>(res => {
            const id = shortid();
            const dialogInstance: DialogInstance<BaseDialogProps> = {
                id,
                open: true,
                component: component as DialogInstance<BaseDialogProps>["component"],
                props: props ?? {},
                onClose: this.handleClose.bind(this, id, res),
                onClosed: this.handleClosed.bind(this, id),
            };

            this.setState(({ instances }) => ({
                instances: [...instances, dialogInstance],
            }));
        });
    };

    private showBackdrop = () => {
        this.setState({ backdrop: true });
    };
    private hideBackdrop = () => {
        this.setState({ backdrop: false });
    };

    public render() {
        const { children } = this.props;
        const { instances, backdrop } = this.state;

        return (
            <DialogContext.Provider
                value={{
                    showDialog: this.showDialog,
                    showBackdrop: this.showBackdrop,
                    hideBackdrop: this.hideBackdrop,
                }}
            >
                <>
                    {children}
                    {instances.map(({ id, component: Component, props, ...rest }) => (
                        <Component key={id} {...props} {...rest} />
                    ))}
                    <Backdrop open={backdrop} sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </>
            </DialogContext.Provider>
        );
    }
}
