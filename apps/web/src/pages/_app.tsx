import React from "react";

import Head from "next/head";
import type { AppProps } from "next/app";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import { Layout } from "@components/Layout";

import { theme } from "@styles/theme";
import { PageProps } from "@utils/routes/types";

export default function App({ Component, pageProps }: AppProps<PageProps>) {
    return (
        <>
            <Head>
                <title>{pageProps.title ? `${pageProps.title} - Mailbox` : "Mailbox"}</title>
            </Head>
            <CssVarsProvider theme={theme}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </CssVarsProvider>
        </>
    );
}
