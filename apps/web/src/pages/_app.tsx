import React from "react";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "notistack";

import Head from "next/head";
import type { AppProps } from "next/app";

import { ThemeProvider } from "@mui/material";

import { Splash } from "@components/Splash";
import { DialogProvider } from "@components/Dialog/Provider";
import { EmojiProvider } from "@components/Emoji/Provider";

import { theme } from "@styles/theme";

import { ApolloProvider } from "@apollo/client";
import { useApollo } from "@api/useApollo";

import { PageProps } from "@utils/routes/types";

import "swiper/css";

export default function App({ Component, pageProps }: AppProps<PageProps>) {
    const apolloClient = useApollo(pageProps);

    return (
        <>
            <Head>
                <title>{pageProps.title ? `${pageProps.title} - Mailbox` : "Mailbox"}</title>
            </Head>
            <ApolloProvider client={apolloClient}>
                <RecoilRoot>
                    <ThemeProvider theme={theme}>
                        <DialogProvider>
                            <EmojiProvider client={apolloClient}>
                                <SnackbarProvider />
                                <Splash>
                                    <Component {...pageProps} />
                                </Splash>
                            </EmojiProvider>
                        </DialogProvider>
                    </ThemeProvider>
                </RecoilRoot>
            </ApolloProvider>
        </>
    );
}
