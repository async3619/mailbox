import { render, screen } from "@testing-library/react";

import { createTheme, ThemeProvider } from "@mui/material";

import { DrawerMenuProvider } from "@components/DrawerMenu/Provider";
import { AccountButton } from "./AccountButton";
import { DrawerMenuContext } from "./DrawerMenu";

import { TestAccount } from "../../__tests__/account";

describe("<AccountButton />", () => {
    it("should render AccountButton properly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <DrawerMenuProvider>{() => <AccountButton account={new TestAccount()} />}</DrawerMenuProvider>
            </ThemeProvider>,
        );

        const button = screen.getByLabelText(new TestAccount().getUserId());
        expect(button).toBeInTheDocument();
    });

    it("should open drawer menu when clicked", () => {
        const showDrawerMenu = jest.fn();

        render(
            <ThemeProvider theme={createTheme()}>
                <DrawerMenuContext.Provider value={{ showDrawerMenu }}>
                    {<AccountButton account={new TestAccount()} />}
                </DrawerMenuContext.Provider>
            </ThemeProvider>,
        );

        const button = screen.getByLabelText(new TestAccount().getUserId());
        button.click();

        expect(showDrawerMenu).toBeCalled();
    });
});
