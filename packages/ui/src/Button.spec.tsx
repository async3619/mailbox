import { render } from "@testing-library/react";

import { Button } from "./Button";

describe("<Button />", () => {
    it("should render button correctly", () => {
        const { container } = render(<Button />);
        const root = container.querySelector("button");

        expect(root).toBeInTheDocument();
    });
});
