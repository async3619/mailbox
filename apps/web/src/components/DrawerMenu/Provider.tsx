import React from "react";
import shortid from "shortid";

import { DrawerMenuContext, DrawerMenuContextValue, DrawerMenuInstance } from "@components/DrawerMenu";

interface DrawerMenuProviderProps {
    children: (drawerMenuNode: React.ReactNode) => React.ReactNode;
}
interface DrawerMenuProviderStates {
    instance: DrawerMenuInstance | null;
}

export class DrawerMenuProvider extends React.Component<DrawerMenuProviderProps, DrawerMenuProviderStates> {
    public state: DrawerMenuProviderStates = {
        instance: null,
    };

    private handleClose = () => {
        this.setState(prevState => ({
            instance: prevState.instance ? { ...prevState.instance, open: false } : null,
        }));
    };
    private handleClosed = () => {
        this.setState({ instance: null });
    };

    private showDrawerMenu: DrawerMenuContextValue["showDrawerMenu"] = (component, props?: Record<string, unknown>) => {
        const id = shortid();

        this.setState({
            instance: {
                id,
                component: component as DrawerMenuInstance["component"],
                props: props ?? {},
                open: true,
            },
        });
    };

    public render() {
        const { children } = this.props;
        const { instance } = this.state;

        let drawerMenuNode: React.ReactNode = null;
        if (instance) {
            const { component: Component, props, open } = instance;

            drawerMenuNode = <Component open={open} close={this.handleClose} onClosed={this.handleClosed} {...props} />;
        }

        return (
            <DrawerMenuContext.Provider value={{ showDrawerMenu: this.showDrawerMenu }}>
                {children(drawerMenuNode)}
            </DrawerMenuContext.Provider>
        );
    }
}
