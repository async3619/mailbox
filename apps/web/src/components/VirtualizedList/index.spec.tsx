import { render, screen } from "@testing-library/react";

import { VirtualizedList } from ".";
import { MOCK_NOTIFICATION } from "../../../__tests__/fixture";
import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";

describe("<VirtualizedList />", () => {
    it("should render VirtualizedList properly", async () => {
        render(
            <VirtualizedList items={[]} getItemKey={jest.fn()} defaultHeight={200}>
                {() => null}
            </VirtualizedList>,
        );

        const root = screen.getByTestId("virtualized-list");
        expect(root).toBeInTheDocument();
    });

    it("should render items properly", async () => {
        render(
            <VirtualizedList items={[MOCK_NOTIFICATION]} getItemKey={item => item.id} defaultHeight={200}>
                {item => <div>{item.id}</div>}
            </VirtualizedList>,
        );

        const item = await screen.findByText(MOCK_NOTIFICATION.id);
        expect(item).toBeInTheDocument();
    });

    it("should render load more indicator properly", async () => {
        render(
            <VirtualizedList
                items={[MOCK_NOTIFICATION]}
                getItemKey={item => item.id}
                defaultHeight={200}
                onLoadMore={jest.fn().mockResolvedValue([])}
            >
                {item => <div>{item.id}</div>}
            </VirtualizedList>,
        );

        const loadMore = await screen.findByTestId("intersection-loader");
        expect(loadMore).toBeInTheDocument();
    });

    it("should call onLoadMore when scroll to bottom", async () => {
        const onLoadMore = jest.fn().mockResolvedValue([]);

        render(
            <VirtualizedList
                items={[MOCK_NOTIFICATION]}
                getItemKey={item => item.id}
                defaultHeight={200}
                onLoadMore={onLoadMore}
            >
                {item => <div>{item.id}</div>}
            </VirtualizedList>,
        );

        mockAllIsIntersecting(true);

        const loadMore = await screen.findByTestId("intersection-loader");
        expect(loadMore).toBeInTheDocument();

        expect(onLoadMore).toBeCalledTimes(1);
    });
});
