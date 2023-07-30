import { render, screen } from "@testing-library/react";

import { SelectServiceStep } from "@components/Dialog/AddAccount/SelectServiceStep";
import { ADD_ACCOUNT_STEP } from "@components/Dialog/AddAccount/constants";
import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";

describe("<SelectServiceStep />", () => {
    it("should render SelectServiceStep properly", () => {
        render(
            <ThemeProvider theme={theme}>
                <SelectServiceStep step={ADD_ACCOUNT_STEP} moveNext={jest.fn()} />
            </ThemeProvider>,
        );

        const addMastodonAccount = screen.getByText("actions.addAccount.mastodon.title");
        expect(addMastodonAccount).toBeInTheDocument();
    });

    it("should move to next step when click Add Mastodon Account button", () => {
        const moveNext = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <SelectServiceStep step={ADD_ACCOUNT_STEP} moveNext={moveNext} />
            </ThemeProvider>,
        );

        const addMastodonAccount = screen.getByText("actions.addAccount.mastodon.title");
        addMastodonAccount.click();
        expect(moveNext).toBeCalledWith("mastodon");
    });
});
