import React from "react";

import { ColumnContainer } from "@components/Column/Container";
import { Layout } from "@components/Layout";
import { useDialog } from "@components/Dialog";

import { useAccounts, useHydrateAccounts } from "@states/accounts";
import { useColumns } from "@states/columns";

import { MastodonAuth } from "@services/mastodon/auth";
import { isMastodonTempAuthData, MASTODON_TEMP_AUTH_KEY } from "@services/mastodon/constants";
import { MastodonAccount } from "@services/mastodon/account";

import { installRouteMiddleware } from "@utils/routes/middleware";
import { PageProps } from "@utils/routes/types";

export interface IndexProps extends PageProps {
    mastodonCode?: string;
}

export default function Index(props: IndexProps) {
    const code = React.useRef(props.mastodonCode);
    const { addAccount } = useAccounts();
    const { showBackdrop, hideBackdrop } = useDialog();
    const [columns, setColumns] = useColumns();

    useHydrateAccounts();

    React.useEffect(() => {
        if (!code.current) {
            return;
        }

        const rawAuthData = localStorage.getItem(MASTODON_TEMP_AUTH_KEY);
        if (!rawAuthData) {
            return;
        }

        const authData = JSON.parse(rawAuthData);
        if (!isMastodonTempAuthData(authData)) {
            throw new Error("There was something wrong with the Mastodon authentication process.");
        }

        showBackdrop();

        const { instanceUrl, client_id, client_secret, redirect_uri } = authData;
        const mastodonAuth = new MastodonAuth(instanceUrl);

        mastodonAuth
            .getToken(client_id, client_secret, redirect_uri, code.current)
            .then(data => MastodonAccount.create(instanceUrl, data))
            .then(account => {
                addAccount(account);
                localStorage.removeItem(MASTODON_TEMP_AUTH_KEY);
                hideBackdrop();
            });
    }, [addAccount, hideBackdrop, showBackdrop]);

    return (
        <Layout>
            <ColumnContainer columns={columns} setColumns={setColumns} />
        </Layout>
    );
}

export const getServerSideProps = installRouteMiddleware<IndexProps>()(async ({ query }) => {
    const { code } = query;
    if (code && typeof code === "string") {
        return { props: { mastodonCode: code } };
    }

    return { props: {} };
});
