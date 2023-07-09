import React from "react";
import { Scrollbars } from "rc-scrollbars";

import { Box, CssBaseline, NoSsr } from "@mui/material";

import { Navigator } from "@components/Layout/Navigator";
import { LayoutContext } from "@components/Layout/context";
import { GlobalStyles } from "@components/Layout/index.styles";

import { Global } from "@emotion/react";
import { DRAWER_WIDTH } from "@styles/constants";
import { DrawerMenuProvider } from "@components/DrawerMenu/Provider";

export interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [scrollBarRef, setScrollBarRef] = React.useState<Scrollbars | null>(null);

    return (
        <LayoutContext.Provider value={{ scroller: scrollBarRef }}>
            <DrawerMenuProvider>
                {drawerMenuNode => (
                    <NoSsr>
                        <Global styles={GlobalStyles} />
                        <CssBaseline />
                        <Navigator />
                        <Box position="fixed" top={0} left={DRAWER_WIDTH} right={0} bottom={0}>
                            {drawerMenuNode}
                            <Scrollbars ref={setScrollBarRef}>
                                <Box display="flex" height="100vh">
                                    <Box component="main" p={1} flex="1 1 auto">
                                        {children}
                                    </Box>
                                </Box>
                            </Scrollbars>
                        </Box>
                    </NoSsr>
                )}
            </DrawerMenuProvider>
        </LayoutContext.Provider>
    );
}
