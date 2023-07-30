import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";

import { NotificationView } from "@components/Timeline/NotificationView";
import { ColumnContext } from "@components/Column/context";
import { ColumnInstance } from "@components/Column/types";

import { theme } from "@styles/theme";
import { NotificationItem } from "services";

import {
    MOCK_FAVOURITE_NOTIFICATION,
    MOCK_MENTION_NOTIFICATION,
    MOCK_NOTIFICATION,
    MOCK_POLL_NOTIFICATION,
    MOCK_REBLOG_NOTIFICATION,
} from "../../../__tests__/fixture";
import { MockEmojiProvider } from "../../../__tests__/emoji";

interface ContentProps {
    notification: NotificationItem;
}

function Content({ notification }: ContentProps) {
    return (
        <ThemeProvider theme={theme}>
            <MockEmojiProvider>
                <ColumnContext.Provider value={{ column: {} as ColumnInstance }}>
                    <NotificationView notification={notification} />
                </ColumnContext.Provider>
            </MockEmojiProvider>
        </ThemeProvider>
    );
}

describe("<NotificationView />", () => {
    it("should render NotificationView properly", async () => {
        await act(async () => await render(<Content notification={MOCK_NOTIFICATION} />));

        const root = screen.getByTestId("notification-view");
        expect(root).toBeInTheDocument();
    });

    it("should be able to render follow notification", async () => {
        await act(async () => await render(<Content notification={MOCK_NOTIFICATION} />));

        const helperText = screen.getByText("followed you");
        expect(helperText).toBeInTheDocument();
    });

    it("should be able to render favourite notification", async () => {
        await act(async () => await render(<Content notification={MOCK_FAVOURITE_NOTIFICATION} />));

        const root = screen.getByTestId("notification-view");
        expect(root).toBeInTheDocument();
    });

    it("should be able to render reblog notification", async () => {
        await act(async () => await render(<Content notification={MOCK_REBLOG_NOTIFICATION} />));

        const helperText = screen.getByText("reposted your post");
        expect(helperText).toBeInTheDocument();
    });

    it("should be able to render poll notification", async () => {
        await act(async () => await render(<Content notification={MOCK_POLL_NOTIFICATION} />));

        const helperText = screen.getByText("Voted poll by", { exact: false });
        expect(helperText).toBeInTheDocument();
    });

    it("should be able to render mention notification", async () => {
        await act(async () => await render(<Content notification={MOCK_MENTION_NOTIFICATION} />));

        const contentWrapper = screen.getByTestId("content-wrapper");
        expect(contentWrapper).toBeInTheDocument();
    });

    it("should be able to group multiple users", async () => {
        // create 4 different users with MOCK_NOTIFICATION.users[0] as a base
        const users = Array.from({ length: 4 }, (_, index) => ({
            ...MOCK_NOTIFICATION.users[0],
            accountId: `${index}`,
        }));

        await act(async () => {
            return await render(<Content notification={{ ...MOCK_NOTIFICATION, users }} />);
        });

        const helperText = screen.getByText("and 3 others followed you");
        expect(helperText).toBeInTheDocument();
    });
});
