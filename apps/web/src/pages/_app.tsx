import React from "react";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "notistack";

import Head from "next/head";
import type { AppProps } from "next/app";

import { ThemeProvider } from "@mui/material";

import { Splash } from "@components/Splash";
import { DialogProvider } from "@components/Dialog/Provider";

import { theme } from "@styles/theme";

import { PageProps } from "@utils/routes/types";

import "swiper/css";

export default function App({ Component, pageProps }: AppProps<PageProps>) {
    return (
        <>
            <Head>
                <title>{pageProps.title ? `${pageProps.title} - Mailbox` : "Mailbox"}</title>
            </Head>
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <DialogProvider>
                        <SnackbarProvider />
                        <Splash>
                            <Component {...pageProps} />
                        </Splash>
                    </DialogProvider>
                </ThemeProvider>
            </RecoilRoot>
        </>
    );
}
