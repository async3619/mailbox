import { createTheme, ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";

import { List } from "./List";
import { ListItem } from "./ListItem";

describe("<ListItem />", () => {
    it("should render ListItem correctly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <List>
                    <ListItem>__TEST__</ListItem>
                </List>
            </ThemeProvider>,
        );

        const text = screen.getByText("__TEST__");
        expect(text).toBeInTheDocument();
        expect(text).toHaveClass("MuiTypography-root");
    });

    it("should render ListItem with start icon correctly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <List>
                    <ListItem startIcon={<div>__START_ICON__</div>}>__TEST__</ListItem>
                </List>
            </ThemeProvider>,
        );

        const startIcon = screen.getByText("__START_ICON__");
        expect(startIcon).toBeInTheDocument();
    });

    it("should render ListItem with end icon correctly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <List>
                    <ListItem endIcon={<div>__END_ICON__</div>}>__TEST__</ListItem>
                </List>
            </ThemeProvider>,
        );

        const endIcon = screen.getByText("__END_ICON__");
        expect(endIcon).toBeInTheDocument();
    });
});
