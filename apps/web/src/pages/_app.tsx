import React from "react";
import { RecoilRoot } from "recoil";

import Head from "next/head";
import type { AppProps } from "next/app";

import { ThemeProvider } from "@mui/material";

import { DialogProvider } from "@components/Dialog/Provider";

import { theme } from "@styles/theme";
import { PageProps } from "@utils/routes/types";

export default function App({ Component, pageProps }: AppProps<PageProps>) {
    return (
        <>
            <Head>
                <title>{pageProps.title ? `${pageProps.title} - Mailbox` : "Mailbox"}</title>
            </Head>
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <DialogProvider>
                        <Component {...pageProps} />
                    </DialogProvider>
                </ThemeProvider>
            </RecoilRoot>
        </>
    );
}
