import { ThemeProvider } from "@mui/material";
import { act, render, screen } from "@testing-library/react";

import { theme } from "@styles/theme";

import { Timeline } from ".";

import { MOCK_TIMELINE_POSTS } from "../../../__tests__/fixture";
import { MockEmojiProvider } from "../../../__tests__/emoji";

describe("<Timeline />", () => {
    it("should render Timeline properly", async () => {
        await act(async () => {
            await render(
                <MockEmojiProvider>
                    <ThemeProvider theme={theme}>
                        <Timeline items={[]} />
                    </ThemeProvider>
                </MockEmojiProvider>,
            );
        });

        const root = screen.getByTestId("virtualized-list");
        expect(root).toBeInTheDocument();
    });

    it("should render timeline items properly", async () => {
        await act(async () => {
            await render(
                <MockEmojiProvider>
                    <ThemeProvider theme={theme}>
                        <Timeline items={MOCK_TIMELINE_POSTS} />
                    </ThemeProvider>
                </MockEmojiProvider>,
            );
        });

        const item = screen.getByTestId("timeline-item-view");
        expect(item).toBeInTheDocument();
    });
});
