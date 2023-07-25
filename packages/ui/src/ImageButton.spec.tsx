import { render } from "@testing-library/react";

import { ImageButton } from "./ImageButton";
import { createTheme, ThemeProvider } from "@mui/material";

describe("<ImageButton />", () => {
    it("should render ImageButton correctly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <ImageButton imageSrc="__TEST__" />
            </ThemeProvider>,
        );

        const root = document.querySelector("button");

        expect(root).toBeInTheDocument();
        expect(root).toHaveStyle("background-image: url(__TEST__);");
    });
});
