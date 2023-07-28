import { render, screen } from "@testing-library/react";

import { IconButton } from "./IconButton";

describe("<IconButton />", () => {
    it("should render IconButton correctly", () => {
        render(<IconButton />);

        const root = screen.getByRole("button");

        expect(root).toBeInTheDocument();
    });

    it("should render IconButton with tooltip correctly", () => {
        render(<IconButton tooltip="__TEST_TOOLTIP__" />);

        const root = screen.getByRole("button");
        const tooltip = screen.getByLabelText("__TEST_TOOLTIP__");

        expect(root).toBeInTheDocument();
        expect(tooltip).toBeInTheDocument();
    });
});
