import dayjs from "dayjs";
import React from "react";
import { render, screen } from "@testing-library/react";

import { PostContent } from "@components/Timeline/PostContent";

import { TimelinePost } from "@services/types";
import { createTheme, ThemeProvider } from "@mui/material";

const MOCKED_ITEM: TimelinePost = {
    id: "1",
    content: [
        {
            type: "text",
            text: "Hello, world!",
        },
    ],
    author: {
        accountId: "",
        accountName: "",
        avatarUrl: "",
        instanceUrl: "",
    },
    attachments: [],
    createdAt: dayjs(),
    sensitive: false,
    serviceType: "mastodon",
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

describe("<PostContent />", () => {
    it("should render post content properly", async () => {
        render(<PostContent spoilerOpened={false} onSpoilerStatusChange={noop} item={MOCKED_ITEM} />);

        const content = await screen.findByText("Hello, world!");

        expect(content).toBeInTheDocument();
    });

    it("should hide post content by default if spoiler flag has set", function () {
        render(
            <ThemeProvider theme={createTheme()}>
                <PostContent
                    spoilerOpened={false}
                    onSpoilerStatusChange={noop}
                    item={{ ...MOCKED_ITEM, spoilerText: "Spoiler!" }}
                />
            </ThemeProvider>,
        );

        const contentWrapper = screen.queryByTestId("content-wrapper");
        expect(contentWrapper).not.toBeInTheDocument();
    });

    it("should show post content if opening spoiler flag has set", function () {
        render(
            <ThemeProvider theme={createTheme()}>
                <PostContent
                    spoilerOpened
                    onSpoilerStatusChange={noop}
                    item={{ ...MOCKED_ITEM, spoilerText: "Spoiler!" }}
                />
            </ThemeProvider>,
        );

        const contentWrapper = screen.queryByTestId("content-wrapper");
        expect(contentWrapper).toBeInTheDocument();
    });

    it("should call onSpoilerStatusChange callback when spoiler button has clicked", () => {
        const onSpoilerStatusChange = jest.fn();
        const item = {
            ...MOCKED_ITEM,
            spoilerText: "Spoiler!",
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <PostContent spoilerOpened onSpoilerStatusChange={onSpoilerStatusChange} item={item} />
            </ThemeProvider>,
        );

        const spoilerButton = screen.getByRole("button", { name: "Hide" });
        spoilerButton.click();

        expect(onSpoilerStatusChange).toHaveBeenCalledWith(item, false);
    });
});
