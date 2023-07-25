import { render } from "@testing-library/react";

import { Switch } from "./Switch";

describe("<Switch />", () => {
    it("should render Switch correctly", () => {
        render(
            <Switch
                options={{
                    "1": "1",
                    "2": "2",
                }}
                value="1"
            />,
        );

        const buttons = document.querySelectorAll("button");

        expect(buttons.length).toBe(2);
    });

    it("should call onChange when button is clicked", () => {
        const onChange = jest.fn();
        render(
            <Switch
                options={{
                    "1": "1",
                    "2": "2",
                }}
                value="1"
                onChange={onChange}
            />,
        );

        const buttons = document.querySelectorAll("button");

        expect(buttons.length).toBe(2);

        buttons[1].click();

        expect(onChange).toBeCalledTimes(1);
        expect(onChange).toBeCalledWith("2");
    });

    it("should render button as contained when value is selected", () => {
        render(
            <Switch
                options={{
                    "1": "1",
                    "2": "2",
                }}
                value="2"
            />,
        );

        const containedButton = document.querySelector(".MuiButton-contained");
        const outlinedButton = document.querySelector(".MuiButton-outlined");

        expect(containedButton).toHaveTextContent("2");
        expect(containedButton).toBeInTheDocument();
        expect(outlinedButton).toBeInTheDocument();
    });
});
