import { render } from "@testing-library/react";

import { MastodonLoginStep } from "@components/Dialog/AddAccount/MastodonLoginStep";
import { createNormalStep } from "@components/Stepper/utils";
import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";

const step = createNormalStep({
    component: MastodonLoginStep,
});

describe("<MastodonLoginStep />", () => {
    it("should render MastodonLoginStep properly", () => {
        const { container } = render(
            <ThemeProvider theme={theme}>
                <MastodonLoginStep step={step} moveNext={jest.fn()} />
            </ThemeProvider>,
        );

        const root = container.querySelector("form");
        expect(root).toBeInTheDocument();
    });
});
