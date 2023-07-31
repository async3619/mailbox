import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material";

import { Button } from "./Button";

describe("<Button />", () => {
    it("should render button correctly", () => {
        const { container } = render(<Button />);
        const root = container.querySelector("button");

        expect(root).toBeInTheDocument();
    });

    it("should be able to render with minimal style", () => {
        const { container } = render(
            <ThemeProvider theme={createTheme()}>
                <Button minimal />
            </ThemeProvider>,
        );
        const root = container.querySelector("button");

        expect(root).toHaveStyle({
            minWidth: "auto",
        });
    });

    it("should be able to render with tooltip", () => {
        render(<Button tooltip="Tooltip" />);
        const root = screen.getByLabelText("Tooltip");

        expect(root).toBeInTheDocument();
    });
});
