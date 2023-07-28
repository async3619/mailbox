import { render, screen } from "@testing-library/react";

import { createTheme, ThemeProvider } from "@mui/material";

import { ColumnInstance } from "@components/Column/types";

import { BaseColumnSidebar } from "./Base";

describe("<BaseColumnSidebar />", () => {
    it("should render BaseColumnSidebar properly", () => {
        const instance: ColumnInstance = {} as ColumnInstance;

        render(
            <ThemeProvider theme={createTheme()}>
                <BaseColumnSidebar instance={instance}>
                    <div data-testid="test">test</div>
                </BaseColumnSidebar>
            </ThemeProvider>,
        );

        const root = screen.getByTestId("test");
        expect(root).toBeInTheDocument();
    });
});
