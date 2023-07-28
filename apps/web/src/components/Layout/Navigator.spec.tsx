import { RecoilRoot } from "recoil";

import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";

import { DialogProvider } from "@components/Dialog/Provider";
import { Navigator } from "@components/Layout/Navigator";
import { DrawerMenuProvider } from "@components/DrawerMenu/Provider";

import { accountState } from "@states/accounts";
import { theme } from "@styles/theme";

import { TestAccount } from "../../../__tests__/account";

describe("<Navigator />", () => {
    it("should render Navigator properly", () => {
        const { container } = render(
            <RecoilRoot>
                <DialogProvider>
                    <Navigator />
                </DialogProvider>
            </RecoilRoot>,
        );

        const root = container.querySelector(".MuiDrawer-root");
        expect(root).toBeInTheDocument();
    });

    it("should render registered accounts", () => {
        render(
            <RecoilRoot
                initializeState={snapshot => {
                    snapshot.set(accountState, {
                        accounts: [new TestAccount(), new TestAccount("__ALT_USER__")],
                        hydrators: [],
                    });
                }}
            >
                <ThemeProvider theme={theme}>
                    <DrawerMenuProvider>
                        {() => (
                            <DialogProvider>
                                <Navigator />
                            </DialogProvider>
                        )}
                    </DrawerMenuProvider>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const testAccount = screen.getByLabelText("__TEST__");
        expect(testAccount).toBeInTheDocument();

        const altAccount = screen.getByLabelText("__ALT_USER__");
        expect(altAccount).toBeInTheDocument();
    });

    it("should show dialog when add account button is clicked", () => {
        render(
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <DrawerMenuProvider>
                        {() => (
                            <DialogProvider>
                                <Navigator />
                            </DialogProvider>
                        )}
                    </DrawerMenuProvider>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const addAccountButton = screen.getByLabelText("Add Account");
        expect(addAccountButton).toBeInTheDocument();

        act(() => {
            addAccountButton.click();
        });

        const addAccountDialogTitle = screen.getByText("Add New Account");
        expect(addAccountDialogTitle).toBeInTheDocument();
    });
});
