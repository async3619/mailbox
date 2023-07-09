import React from "react";
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from "recoil-persist";

import { useDialog } from "@components/Dialog";

import { AccountHydrator, BaseAccount } from "@services/base/account";
import { hydrateAccount } from "@services/index";

export enum HydrationStatus {
    Prepare,
    Hydrating,
    Done,
}

export interface AccountStateData {
    accounts: BaseAccount<string>[];
    hydrators: AccountHydrator<BaseAccount<string>>[];
}
interface StateData {
    accountState: AccountStateData;
}

const { persistAtom: accountPersistAtom } = recoilPersist({
    key: "accountState",
    converter: {
        stringify: ({ accountState: { accounts } }: StateData) => {
            return JSON.stringify(accounts.map(account => account.serialize()));
        },
        parse: (accounts: string): StateData => {
            return {
                accountState: {
                    accounts: [],
                    hydrators: hydrateAccount(accounts),
                },
            };
        },
    },
});

export const accountState = atom<AccountStateData>({
    key: "accountState",
    default: {
        accounts: [],
        hydrators: [],
    },
    effects: [accountPersistAtom],
});

export function useAccounts() {
    const [{ accounts }, setAccountData] = useRecoilState(accountState);
    const addAccount = React.useCallback(
        (account: BaseAccount<string>) => {
            setAccountData(data => {
                const newAccounts = [...data.accounts, account];

                return {
                    ...data,
                    accounts: newAccounts,
                };
            });
        },
        [setAccountData],
    );

    return { accounts, addAccount };
}
export function useHydrateAccounts() {
    const [{ hydrators }, setAccountData] = useRecoilState(accountState);
    const [hydrationStatus, setHydrationStatus] = React.useState<HydrationStatus>(HydrationStatus.Prepare);
    const dialog = useDialog();
    const hydrate = React.useCallback(async () => {
        if (hydrators.length === 0) {
            setHydrationStatus(HydrationStatus.Done);
            return;
        }

        if (hydrationStatus !== HydrationStatus.Prepare) {
            return;
        }

        setHydrationStatus(HydrationStatus.Hydrating);
        dialog.showBackdrop();

        const newAccounts = await Promise.all(hydrators.map(hydrator => hydrator.hydrate()));
        setAccountData(data => {
            return {
                ...data,
                accounts: [...data.accounts, ...newAccounts],
                hydrators: [],
            };
        });

        dialog.hideBackdrop();
        setHydrationStatus(HydrationStatus.Done);
    }, [dialog, hydrators, hydrationStatus, setAccountData]);

    React.useEffect(() => {
        hydrate();
    }, [hydrate]);

    return { hydrationStatus };
}
