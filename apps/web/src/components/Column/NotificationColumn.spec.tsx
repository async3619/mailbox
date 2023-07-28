import { act, render } from "@testing-library/react";
import { RecoilRoot } from "recoil";

import { createTheme, ThemeProvider } from "@mui/material";

import { accountState } from "@states/accounts";
import { BaseAccount } from "services";

import { NotificationColumn } from "@components/Column/NotificationColumn";
import { NotificationColumnInstance } from "@components/Column/types";

import { TestAccount } from "../../../__tests__/account";

interface WrapperProps {
    accounts: BaseAccount<string>[];
}

function Wrapper({ accounts }: WrapperProps) {
    const instance: NotificationColumnInstance = {
        accountId: accounts[0]?.getUniqueId() ?? "__EMPTY__",
    } as NotificationColumnInstance;

    return (
        <RecoilRoot
            initializeState={snapshot => {
                snapshot.set(accountState, {
                    accounts,
                    hydrators: [],
                });
            }}
        >
            <ThemeProvider theme={createTheme()}>
                <NotificationColumn instance={instance} />
            </ThemeProvider>
        </RecoilRoot>
    );
}

describe("<NotificationColumn />", () => {
    it("should render NotificationColumn properly", async () => {
        await act(() => render(<Wrapper accounts={[new TestAccount()]} />));
    });

    it("should render nothing if failed to find matching account", async () => {
        await act(() => render(<Wrapper accounts={[]} />));
    });
});
