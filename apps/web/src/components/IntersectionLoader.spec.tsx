/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from "@testing-library/react";
import { IntersectionLoader } from "@components/IntersectionLoader";

import { mockAllIsIntersecting } from "react-intersection-observer/test-utils";

describe("<IntersectionLoader />", () => {
    it("should render IntersectionLoader properly", () => {
        render(<IntersectionLoader onLoadMore={() => {}} />);

        const root = screen.getByTestId("intersection-loader");
        expect(root).toBeInTheDocument();
    });

    it("should call onLoadMore when inView is true", () => {
        const onLoadMore = jest.fn();
        render(<IntersectionLoader onLoadMore={onLoadMore} />);

        mockAllIsIntersecting(true);

        const root = screen.getByTestId("intersection-loader");
        expect(root).toBeInTheDocument();

        expect(onLoadMore).toBeCalledTimes(1);
    });
});
