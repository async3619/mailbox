import { render, screen } from "@testing-library/react";

import { List } from "./List";

describe("<List />", () => {
    it("should render List correctly", () => {
        render(
            <List>
                <div>__TEST__</div>
            </List>,
        );

        const root = screen.getByText("__TEST__");
        expect(root).toBeInTheDocument();
    });
});
