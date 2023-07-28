import React from "react";
import { act, render, screen } from "@testing-library/react";

import { TimelineSubscription } from "@components/TimelineSubscription";

import { NotificationItem, TimelinePost, TimelineType } from "@services/types";

import { TestAccount } from "../../__tests__/account";

describe("<TimelineSubscription />", () => {
    let account: TestAccount;

    beforeEach(() => {
        account = new TestAccount();
    });

    it("should render TimelineSubscription properly", async () => {
        await act(() =>
            render(
                <TimelineSubscription account={account} type={TimelineType.Local}>
                    {() => <div data-testid="content" />}
                </TimelineSubscription>,
            ),
        );

        const content = screen.getByTestId("content");
        expect(content).toBeInTheDocument();
    });

    it("should not fetch items if account is not ready", async () => {
        const fetchItemsSpy = jest.spyOn(account, "getTimelinePosts");

        await act(() =>
            render(
                <TimelineSubscription account={null} type={TimelineType.Local}>
                    {() => <div data-testid="content" />}
                </TimelineSubscription>,
            ),
        );

        expect(fetchItemsSpy).not.toHaveBeenCalled();
    });

    it("should fetch and subscribe items from account on mount (non Notifications)", async () => {
        const fetchItemsSpy = jest
            .spyOn(account, "getTimelinePosts")
            .mockReturnValue([Array.from(new Array(40), (_, index) => ({ id: `${index}` }))] as any);
        const startWatchSpy = jest.spyOn(account, "startWatch");

        await act(() =>
            render(
                <TimelineSubscription account={account} type={TimelineType.Local}>
                    {items => <div data-testid="content">{items.length}</div>}
                </TimelineSubscription>,
            ),
        );

        expect(fetchItemsSpy).toHaveBeenCalledWith(TimelineType.Local, 20);
        expect(startWatchSpy).toHaveBeenCalledWith(TimelineType.Local);

        const content = screen.getByTestId("content");
        expect(content).toHaveTextContent("40");
    });

    it("should fetch and subscribe items from account on mount (Notifications)", async () => {
        const fetchItemsSpy = jest
            .spyOn(account, "getNotificationItems")
            .mockReturnValue([Array.from(new Array(40), (_, index) => ({ id: `${index}` }))] as any);
        const startWatchSpy = jest.spyOn(account, "startWatch");

        await act(() =>
            render(
                <TimelineSubscription account={account} type={TimelineType.Notifications}>
                    {items => <div data-testid="content">{items.length}</div>}
                </TimelineSubscription>,
            ),
        );

        expect(fetchItemsSpy).toHaveBeenCalledWith(20);
        expect(startWatchSpy).toHaveBeenCalledWith(TimelineType.Notifications);

        const content = screen.getByTestId("content");
        expect(content).toHaveTextContent("40");
    });

    it("should trim out items if there are more than maxCount", async () => {
        const fetchItemsSpy = jest
            .spyOn(account, "getTimelinePosts")
            .mockReturnValue([Array.from(new Array(40), (_, index) => ({ id: `${index}` }))] as any);
        const startWatchSpy = jest.spyOn(account, "startWatch");

        await act(() =>
            render(
                <TimelineSubscription shouldTrim account={account} type={TimelineType.Local} maxCount={20}>
                    {items => <div data-testid="content">{items.length}</div>}
                </TimelineSubscription>,
            ),
        );

        expect(fetchItemsSpy).toHaveBeenCalledWith(TimelineType.Local, 20);
        expect(startWatchSpy).toHaveBeenCalledWith(TimelineType.Local);

        const content = screen.getByTestId("content");
        expect(content).toHaveTextContent("20");
    });

    it("should be able to add new items to the list", async () => {
        await act(() =>
            render(
                <TimelineSubscription shouldTrim account={account} type={TimelineType.Local} maxCount={20}>
                    {items => <div data-testid="content">{items.length}</div>}
                </TimelineSubscription>,
            ),
        );

        act(() => {
            account["emit"]("new-post", TimelineType.Local, { id: "1" } as TimelinePost);

            // with same id, should not be added
            account["emit"]("new-post", TimelineType.Local, { id: "1" } as TimelinePost);

            // with different TimelineType, should not be added
            account["emit"]("new-post", TimelineType.Home, { id: "1" } as TimelinePost);
        });

        const content = screen.getByTestId("content");
        expect(content).toHaveTextContent("1");
    });

    it("should be able to delete items from the list", async () => {
        jest.spyOn(account, "getTimelinePosts").mockReturnValue([
            Array.from(new Array(40), (_, index) => ({ id: `${index}` })),
        ] as any);

        await act(() =>
            render(
                <TimelineSubscription shouldTrim account={account} type={TimelineType.Local} maxCount={20}>
                    {items => <div data-testid="content">{items.length}</div>}
                </TimelineSubscription>,
            ),
        );

        act(() => {
            account["emit"]("delete-post", TimelineType.Local, "1");

            // with different TimelineType, should not be deleted
            account["emit"]("delete-post", TimelineType.Home, "2");
        });

        const content = screen.getByTestId("content");
        expect(content).toHaveTextContent("19");
    });

    it("should be able to update items in the list", async () => {
        jest.spyOn(account, "getTimelinePosts").mockReturnValue([
            Array.from(new Array(40), (_, index) => ({ id: `${index}` })),
        ] as any);

        await act(() =>
            render(
                <TimelineSubscription shouldTrim account={account} type={TimelineType.Local} maxCount={20}>
                    {items => <div data-testid="content">{items.length > 0 ? (items[0] as any).data : undefined}</div>}
                </TimelineSubscription>,
            ),
        );

        act(() => {
            account["emit"]("update-post", TimelineType.Local, {
                id: "0",
                data: "new data",
            } as unknown as TimelinePost);

            // if post is not in the list, should not be updated
            account["emit"]("update-post", TimelineType.Local, {
                id: "200",
            } as unknown as TimelinePost);
        });

        const content = screen.getByTestId("content");
        expect(content).toHaveTextContent("new data");
    });

    it("should be able to add new notifications to the list", async () => {
        await act(() =>
            render(
                <TimelineSubscription shouldTrim account={account} type={TimelineType.Notifications} maxCount={20}>
                    {items => <div data-testid="content">{items.length}</div>}
                </TimelineSubscription>,
            ),
        );

        act(() => {
            account["emit"]("new-notification", { id: "1" } as NotificationItem);

            // if notification is already in the list, should not be added
            account["emit"]("new-notification", { id: "1" } as NotificationItem);
        });

        const content = screen.getByTestId("content");
        expect(content).toHaveTextContent("1");
    });

    it("should be able to load more items (non Notifications)", async () => {
        const getTimelinePostSpy = jest.spyOn(account, "getTimelinePosts");

        await act(() =>
            render(
                <TimelineSubscription loadMore shouldTrim account={account} type={TimelineType.Home} maxCount={20}>
                    {(_, __, loadMore) => <button data-testid="button" onClick={() => loadMore?.("0")} />}
                </TimelineSubscription>,
            ),
        );

        const button = screen.getByTestId("button");
        await act(() => button.click());

        expect(getTimelinePostSpy).toHaveBeenNthCalledWith(2, TimelineType.Home, 20, "0");
    });

    it("should be able to load more items (Notifications)", async () => {
        const getNotificationItemsSpy = jest
            .spyOn(account, "getNotificationItems")
            .mockReturnValue([Array.from(new Array(40), (_, index) => ({ id: `${index}` }))] as any);

        await act(() =>
            render(
                <TimelineSubscription
                    loadMore
                    shouldTrim
                    account={account}
                    type={TimelineType.Notifications}
                    maxCount={20}
                >
                    {(_, __, loadMore) => <button data-testid="button" onClick={() => loadMore?.("0")} />}
                </TimelineSubscription>,
            ),
        );

        const button = screen.getByTestId("button");
        await act(() => button.click());

        expect(getNotificationItemsSpy).toHaveBeenNthCalledWith(2, 20, "0");
    });

    it("should stop and start subscription when account is changed", async () => {
        const newAccount = new TestAccount();
        const oldAccount = account;

        const stopSubscriptionSpy = jest.spyOn(oldAccount, "removeEventListener");
        const startSubscriptionSpy = jest.spyOn(newAccount, "startWatch");

        function MockComponent() {
            const [account, setAccount] = React.useState<TestAccount>(oldAccount);

            return (
                <TimelineSubscription account={account} type={TimelineType.Notifications} maxCount={20}>
                    {() => <button data-testid="button" onClick={() => setAccount(newAccount)} />}
                </TimelineSubscription>
            );
        }

        await act(() => render(<MockComponent />));

        const button = screen.getByTestId("button");
        await act(() => button.click());

        expect(stopSubscriptionSpy).toHaveBeenCalled();
        expect(startSubscriptionSpy).toHaveBeenCalled();
    });
});
