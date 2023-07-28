import React from "react";
import { RecoilRoot } from "recoil";

import { ThemeProvider } from "@mui/material";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { MastodonAddColumnDrawerMenu } from "@components/DrawerMenu/MastodonAddColumn";
import { theme } from "@styles/theme";
import { useColumns } from "@states/columns";

import { TestAccount } from "../../../__tests__/account";

function MockComponent() {
    const { columns } = useColumns();

    return (
        <div>
            {columns.map(column => (
                <div key={column.id}>{column.title} Column</div>
            ))}
        </div>
    );
}

function Content({ children }: React.PropsWithChildren) {
    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <MastodonAddColumnDrawerMenu
                    onClosed={jest.fn()}
                    open
                    account={new TestAccount("__TEST__", "mastodon")}
                    close={jest.fn()}
                />
                {children}
            </ThemeProvider>
        </RecoilRoot>
    );
}

describe("<MastodonAddColumnDrawerMenu />", () => {
    it("should render MastodonAddColumnDrawerMenu properly", async () => {
        render(<Content />);
    });

    it("should throw error when its account is not MastodonAccount", () => {
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => null);

        expect(() => {
            render(
                <RecoilRoot>
                    <ThemeProvider theme={theme}>
                        <MastodonAddColumnDrawerMenu
                            onClosed={jest.fn()}
                            open
                            account={new TestAccount("__TEST__", "twitter")}
                            close={jest.fn()}
                        />
                    </ThemeProvider>
                </RecoilRoot>,
            );
        }).toThrowError();

        errorSpy.mockRestore();
    });

    it("should add home timeline column when click home timeline button", async () => {
        render(
            <Content>
                <MockComponent />
            </Content>,
        );

        const homeTimelineButton = screen.getByText("Home");
        expect(homeTimelineButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(homeTimelineButton, { bubbles: true });
        });

        const home = screen.getByText("Home Column");
        expect(home).toBeInTheDocument();
    });

    it("should add local timeline column when click local timeline button", async () => {
        render(
            <Content>
                <MockComponent />
            </Content>,
        );

        const localTimelineButton = screen.getByText("Local Timeline");
        expect(localTimelineButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(localTimelineButton, { bubbles: true });
        });

        const local = screen.getByText("Local Timeline Column");
        expect(local).toBeInTheDocument();
    });

    it("should add federated timeline column when click federated timeline button", async () => {
        render(
            <Content>
                <MockComponent />
            </Content>,
        );

        const federatedTimelineButton = screen.getByText("Federated Timeline");
        expect(federatedTimelineButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(federatedTimelineButton, { bubbles: true });
        });

        const federated = screen.getByText("Federated Timeline Column");
        expect(federated).toBeInTheDocument();
    });

    it("should add notifications column when click notifications button", async () => {
        render(
            <Content>
                <MockComponent />
            </Content>,
        );

        const notificationsButton = screen.getByText("Notifications");
        expect(notificationsButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(notificationsButton, { bubbles: true });
        });

        const notifications = screen.getByText("Notifications Column");
        expect(notifications).toBeInTheDocument();
    });
});
