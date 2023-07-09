import React from "react";
import { enqueueSnackbar } from "notistack";

import { ColumnContainer } from "@components/Column/Container";
import { Layout } from "@components/Layout";
import { useDialog } from "@components/Dialog";

import { HydrationStatus, useAccounts, useHydrateAccounts } from "@states/accounts";
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
    const { addAccount, accounts } = useAccounts();
    const { showBackdrop, hideBackdrop } = useDialog();
    const { columns, setColumns } = useColumns();
    const { hydrationStatus } = useHydrateAccounts();

    React.useEffect(() => {
        if (!code.current || hydrationStatus !== HydrationStatus.Done) {
            return;
        }

        const rawAuthData = localStorage.getItem(MASTODON_TEMP_AUTH_KEY);
        if (!rawAuthData) {
            return;
        }

        localStorage.removeItem(MASTODON_TEMP_AUTH_KEY);
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
                const oldAccount = accounts.find(acc => acc.getUniqueId() === account.getUniqueId());
                if (!oldAccount) {
                    return account;
                }

                return oldAccount.getUserId();
            })
            .then(account => {
                if (typeof account === "string") {
                    enqueueSnackbar(`Given account ${account} already connected`);
                } else {
                    addAccount(account);
                }

                hideBackdrop();
            })
            .catch(() => {
                hideBackdrop();
                enqueueSnackbar("Failed to connect account", {
                    variant: "error",
                });
            });
    }, [addAccount, hideBackdrop, showBackdrop, accounts, hydrationStatus]);

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
