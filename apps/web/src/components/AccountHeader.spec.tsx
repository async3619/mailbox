import { render, screen } from "@testing-library/react";
import { AccountHeader } from "@components/AccountHeader";
import { TestAccount } from "../../__tests__/account";

describe("<AccountHeader />", () => {
    it("should render AccountHeader properly", () => {
        render(<AccountHeader account={new TestAccount()} titleText="MOCK_TEXT" />);

        const titleText = screen.getByText("MOCK_TEXT");
        expect(titleText).toBeInTheDocument();
    });
});
