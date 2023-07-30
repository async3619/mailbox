import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { TimelineItemReaction } from "@components/Timeline/ItemReaction";
import { theme } from "@styles/theme";

import { Wrapper } from "../../../__tests__/wrapper";

describe("<TimelineItemReaction />", () => {
    it("should render TimelineItemReaction correctly", () => {
        render(
            <ThemeProvider theme={theme}>
                <TimelineItemReaction />
            </ThemeProvider>,
            { wrapper: Wrapper },
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();
    });
});
