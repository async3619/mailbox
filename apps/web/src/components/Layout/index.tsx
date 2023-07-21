import React from "react";
import { Scrollbars } from "rc-scrollbars";

import { Global } from "@emotion/react";
import { Box, CssBaseline, NoSsr } from "@mui/material";

import { MediaProvider } from "@components/Media/Provider";
import { DrawerMenuProvider } from "@components/DrawerMenu/Provider";
import { Navigator } from "@components/Layout/Navigator";
import { LayoutContext } from "@components/Layout/context";
import { useEmojis } from "@components/Emoji/context";
import { useSplash } from "@components/Splash";
import { GlobalStyles } from "@components/Layout/index.styles";

import { HydrationStatus, useHydrateAccounts } from "@states/accounts";
import { DRAWER_WIDTH } from "@styles/constants";

export interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const [scrollBarRef, setScrollBarRef] = React.useState<Scrollbars | null>(null);
    const splash = useSplash();
    const { hydrationStatus } = useHydrateAccounts();
    const emojis = useEmojis();

    React.useEffect(() => {
        if (hydrationStatus !== HydrationStatus.Done || emojis.loading) {
            return;
        }

        splash.hide();
    }, [splash, hydrationStatus, emojis]);

    return (
        <LayoutContext.Provider value={{ scroller: scrollBarRef }}>
            <MediaProvider>
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
            </MediaProvider>
        </LayoutContext.Provider>
    );
}
