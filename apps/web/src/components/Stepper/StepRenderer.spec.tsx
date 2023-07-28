import { createTheme, ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";

import { StepRenderer } from "@components/Stepper/StepRenderer";
import { Step } from "@components/Stepper/types";

import { MockBranchedStep, MockStep } from "../../../__tests__/fixture";

describe("<StepRenderer />", () => {
    it("should render StepRenderer properly", async () => {
        const MOCK_STEP: Step = {
            type: "normal-step",
            component: props => <MockStep {...props} id="1" />,
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <StepRenderer
                    stepHolder={{ step: MOCK_STEP, show: false }}
                    onComplete={jest.fn()}
                    onHeightChange={jest.fn()}
                    onMoveNext={jest.fn()}
                />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("1");
        expect(root).toBeInTheDocument();
    });

    it("should render StepRenderer properly with branched step properly", async () => {
        const MOCK_STEP: Step = {
            type: "branched-step",
            component: props => <MockBranchedStep {...props} id="1" nextId="2" />,
            branches: {},
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <StepRenderer
                    stepHolder={{ step: MOCK_STEP, show: false }}
                    onComplete={jest.fn()}
                    onHeightChange={jest.fn()}
                    onMoveNext={jest.fn()}
                />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("1");
        expect(root).toBeInTheDocument();
    });

    it("should call onMoveNext when move next is called", () => {
        const MOCK_STEP: Step = {
            type: "normal-step",
            component: props => <MockStep {...props} id="1" />,
        };

        const onMoveNext = jest.fn();

        render(
            <ThemeProvider theme={createTheme()}>
                <StepRenderer
                    stepHolder={{ step: MOCK_STEP, show: false }}
                    onComplete={jest.fn()}
                    onHeightChange={jest.fn()}
                    onMoveNext={onMoveNext}
                />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("1");
        expect(root).toBeInTheDocument();

        root.click();

        expect(onMoveNext).toBeCalledTimes(1);
    });
});
