import { render } from "@testing-library/react";
import { LogoSvg } from "./LogoSvg";

describe("<LogoSvg />", () => {
    it("should render LogoSvg properly", () => {
        const context = render(<LogoSvg />);
        const root = context.container.querySelector("svg");

        expect(root).toBeInTheDocument();
    });
});
