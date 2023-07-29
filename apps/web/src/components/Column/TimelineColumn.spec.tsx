import { act, render } from "@testing-library/react";
import { RecoilRoot } from "recoil";

import { createTheme, ThemeProvider } from "@mui/material";

import { accountState } from "@states/accounts";
import { BaseAccount } from "services";

import { TimelineColumn } from "@components/Column/TimelineColumn";
import { TimelineColumnInstance } from "@components/Column/types";

import { TestAccount } from "../../../__tests__/account";

interface WrapperProps {
    accounts: BaseAccount<string>[];
}

function Wrapper({ accounts }: WrapperProps) {
    const instance: TimelineColumnInstance = {
        accountId: accounts[0]?.getUniqueId() ?? "__EMPTY__",
    } as TimelineColumnInstance;

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
                <TimelineColumn instance={instance} />
            </ThemeProvider>
        </RecoilRoot>
    );
}

describe("<TimelineColumn />", () => {
    it("should render TimelineColumn properly", async () => {
        await act(() => render(<Wrapper accounts={[new TestAccount()]} />));
    });

    it("should render nothing if failed to find matching account", async () => {
        await act(() => render(<Wrapper accounts={[]} />));
    });
});
