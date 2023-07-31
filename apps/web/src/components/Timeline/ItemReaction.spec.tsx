import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { TimelineItemReaction } from "@components/Timeline/ItemReaction";
import { theme } from "@styles/theme";

import { Wrapper } from "../../../__tests__/wrapper";
import { MOCK_TIMELINE_POST } from "../../../__tests__/fixture";
import { TestAccount } from "../../../__tests__/account";

describe("<TimelineItemReaction />", () => {
    it("should render TimelineItemReaction correctly", () => {
        render(
            <ThemeProvider theme={theme}>
                <TimelineItemReaction post={MOCK_TIMELINE_POST} />
            </ThemeProvider>,
            { wrapper: Wrapper },
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();
    });

    it("should repost post when repost button is clicked", () => {
        const account = new TestAccount();

        render(
            <Wrapper account={account}>
                <ThemeProvider theme={theme}>
                    <TimelineItemReaction post={MOCK_TIMELINE_POST} />
                </ThemeProvider>
            </Wrapper>,
        );

        const repostButton = screen.getByLabelText("Repost");

        act(() => {
            repostButton.click();
        });

        expect(account.repost).toBeCalledTimes(1);
    });
    it("should cancel repost when reposted post's repost button is clicked", () => {
        const account = new TestAccount();

        render(
            <Wrapper account={account}>
                <ThemeProvider theme={theme}>
                    <TimelineItemReaction post={{ ...MOCK_TIMELINE_POST, reposted: true }} />
                </ThemeProvider>
            </Wrapper>,
        );

        const repostButton = screen.getByLabelText("Repost");

        act(() => {
            repostButton.click();
        });

        expect(account.cancelRepost).toBeCalledTimes(1);
    });

    it("should ignore event when received event is not for target post", () => {
        const account = new TestAccount();

        render(
            <Wrapper account={account}>
                <ThemeProvider theme={theme}>
                    <TimelineItemReaction post={MOCK_TIMELINE_POST} />
                </ThemeProvider>
            </Wrapper>,
        );

        const repostButton = screen.getByLabelText("Repost");
        expect(repostButton).toHaveAttribute("aria-pressed", "false");

        act(() => {
            account.emitEvent("post-state-update", "__MOCK_ID__", "reblog");
        });

        expect(repostButton).toHaveAttribute("aria-pressed", "false");
    });
    it("should update repost state when received repost event", () => {
        const account = new TestAccount();

        render(
            <Wrapper account={account}>
                <ThemeProvider theme={theme}>
                    <TimelineItemReaction post={MOCK_TIMELINE_POST} />
                </ThemeProvider>
            </Wrapper>,
        );

        const repostButton = screen.getByLabelText("Repost");
        expect(repostButton).toHaveAttribute("aria-pressed", "false");

        act(() => {
            account.emitEvent("post-state-update", MOCK_TIMELINE_POST.id, "reblog");
        });

        expect(repostButton).toHaveAttribute("aria-pressed", "true");
    });
    it("should update repost state when received unrepost event", () => {
        const account = new TestAccount();

        render(
            <Wrapper account={account}>
                <ThemeProvider theme={theme}>
                    <TimelineItemReaction post={{ ...MOCK_TIMELINE_POST, reposted: true }} />
                </ThemeProvider>
            </Wrapper>,
        );

        const repostButton = screen.getByLabelText("Repost");
        expect(repostButton).toHaveAttribute("aria-pressed", "true");

        act(() => {
            account.emitEvent("post-state-update", MOCK_TIMELINE_POST.id, "unreblog");
        });

        expect(repostButton).toHaveAttribute("aria-pressed", "false");
    });
});
