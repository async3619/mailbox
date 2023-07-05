import React from "react";
import useMeasure from "react-use-measure";
import { Scrollbars } from "rc-scrollbars";

import { Box, CssBaseline, NoSsr } from "@mui/material";

import { Navigator } from "@components/Navigator";
import { LayoutContext } from "@components/Layout/context";
import { GlobalStyles } from "@components/Layout/index.styles";

import { Global } from "@emotion/react";
import { DRAWER_WIDTH } from "@styles/constants";

export interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [measureRef, {}] = useMeasure();
    const [scrollBarRef, setScrollBarRef] = React.useState<Scrollbars | null>(null);

    return (
        <LayoutContext.Provider value={{ scroller: scrollBarRef }}>
            <NoSsr>
                <Global styles={GlobalStyles} />
                <CssBaseline />
                <Navigator />
                <Box position="fixed" top={0} left={DRAWER_WIDTH} right={0} bottom={0}>
                    <Scrollbars ref={setScrollBarRef}>
                        <Box display="flex" height="100vh">
                            <Box ref={measureRef} component="main" p={1} flex="1 1 auto">
                                {children}
                            </Box>
                        </Box>
                    </Scrollbars>
                </Box>
            </NoSsr>
        </LayoutContext.Provider>
    );
}
