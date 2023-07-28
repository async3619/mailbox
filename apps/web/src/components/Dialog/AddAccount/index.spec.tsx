/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from "@testing-library/react";

import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";

import { AddAccountDialog } from ".";

describe("<AddAccountDialog />", () => {
    it("should render AddAccountDialog properly", () => {
        render(
            <ThemeProvider theme={theme}>
                <AddAccountDialog onClose={jest.fn()} onClosed={jest.fn()} open={true} />
            </ThemeProvider>,
        );

        const addMastodonAccount = screen.getByText("Add Mastodon Account");
        expect(addMastodonAccount).toBeInTheDocument();
    });
});
