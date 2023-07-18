import { useMemo } from "react";
import { AppProps } from "next/app";

import { createClient } from "./createClient";

export function useApollo(pageProps: AppProps["pageProps"]) {
    const state = pageProps.__APOLLO_STATE__;
    const apiUrl = pageProps.apiUrl;

    return useMemo(() => createClient({ initialState: state, url: apiUrl }), [state, apiUrl]);
}
