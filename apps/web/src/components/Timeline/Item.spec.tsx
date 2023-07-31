import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";
import { act, render, screen } from "@testing-library/react";

import { TimelineItemView } from "@components/Timeline/Item";

import { MockEmojiProvider } from "../../../__tests__/emoji";
import {
    MOCK_REPLIED_TIMELINE_POST,
    MOCK_REPOSTED_TIMELINE_POST,
    MOCK_SPOILER_TIMELINE_POST,
    MOCK_TIMELINE_POST,
} from "../../../__tests__/fixture";
import { Wrapper } from "../../../__tests__/wrapper";

describe("<TimelineItemView />", () => {
    it("should render TimelineItemView properly", async () => {
        await act(async () => {
            await render(
                <MockEmojiProvider>
                    <ThemeProvider theme={theme}>
                        <TimelineItemView
                            onSpoilerStatusChange={jest.fn()}
                            spoilerOpened={false}
                            item={MOCK_TIMELINE_POST}
                        />
                    </ThemeProvider>
                </MockEmojiProvider>,
                { wrapper: Wrapper },
            );
        });

        const root = screen.getByTestId("timeline-item-view");
        expect(root).toBeInTheDocument();
    });

    it("should render helper text for reposted post", async () => {
        await act(async () => {
            await render(
                <MockEmojiProvider>
                    <ThemeProvider theme={theme}>
                        <TimelineItemView
                            onSpoilerStatusChange={jest.fn()}
                            spoilerOpened={false}
                            item={MOCK_REPOSTED_TIMELINE_POST}
                        />
                    </ThemeProvider>
                </MockEmojiProvider>,
                { wrapper: Wrapper },
            );
        });

        const helperText = screen.getByText(`${MOCK_REPOSTED_TIMELINE_POST.repostedBy?.accountName} reposted`);
        expect(helperText).toBeInTheDocument();
    });

    it("should render helper text for origin post", async () => {
        await act(async () => {
            await render(
                <MockEmojiProvider>
                    <ThemeProvider theme={theme}>
                        <TimelineItemView
                            onSpoilerStatusChange={jest.fn()}
                            spoilerOpened={false}
                            item={MOCK_REPLIED_TIMELINE_POST}
                        />
                    </ThemeProvider>
                </MockEmojiProvider>,
                { wrapper: Wrapper },
            );
        });

        const helperText = screen.getByText(`replied to ${MOCK_REPLIED_TIMELINE_POST.originPostAuthor?.accountName}`);
        expect(helperText).toBeInTheDocument();
    });

    it("should call onSpoilerStatusChange when spoiler is opened", async () => {
        const onSpoilerStatusChange = jest.fn();

        await act(async () => {
            await render(
                <MockEmojiProvider>
                    <ThemeProvider theme={theme}>
                        <TimelineItemView
                            onSpoilerStatusChange={onSpoilerStatusChange}
                            spoilerOpened={false}
                            item={MOCK_SPOILER_TIMELINE_POST}
                        />
                    </ThemeProvider>
                </MockEmojiProvider>,
                { wrapper: Wrapper },
            );
        });

        const spoilerButton = screen.getByTestId("spoiler-button");
        expect(spoilerButton).toBeInTheDocument();

        await act(async () => {
            await spoilerButton.click();
        });

        expect(onSpoilerStatusChange).toBeCalledTimes(1);
        expect(onSpoilerStatusChange).toBeCalledWith(MOCK_SPOILER_TIMELINE_POST, true);
    });
});
