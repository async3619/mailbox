import React from "react";

import { Box, CssBaseline } from "@mui/material";

import { Navigator } from "@components/Navigator";

export interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <>
            <CssBaseline />
            <Box display="flex">
                <Navigator />
                <Box component="main" p={1}>
                    {children}
                </Box>
            </Box>
        </>
    );
}
