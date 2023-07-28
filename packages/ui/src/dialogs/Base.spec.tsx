import { render, screen } from "@testing-library/react";

import { BaseDialog } from "./Base";

describe("<BaseDialog />", () => {
    it("should render BaseDialog correctly", () => {
        render(
            <BaseDialog open={true} onClose={jest.fn()} onClosed={jest.fn()}>
                <div data-testid="content">__TEST__</div>
            </BaseDialog>,
        );

        const content = screen.getByTestId("content");

        expect(content).toBeInTheDocument();
    });
});
