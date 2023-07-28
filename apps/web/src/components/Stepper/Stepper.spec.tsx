import { act, render, screen } from "@testing-library/react";

import { createTheme, ThemeProvider } from "@mui/material";

import { Stepper } from "@components/Stepper/Stepper";
import { Step } from "@components/Stepper/types";

import { MockBranchedStep, MockStep } from "../../../__tests__/fixture";

describe("<Stepper />", () => {
    it("should render Stepper properly", async () => {
        const MOCK_STEP: Step = {
            type: "normal-step",
            component: () => null,
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <Stepper step={MOCK_STEP} />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("stepper");
        expect(root).toBeInTheDocument();
    });

    it("should move to next step when move next is called", () => {
        const MOCK_STEP: Step = {
            type: "normal-step",
            component: props => <MockStep {...props} id="1" />,
            next: {
                type: "normal-step",
                component: props => <MockStep {...props} id="2" />,
            },
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <Stepper step={MOCK_STEP} />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("1");
        expect(root).toBeInTheDocument();

        act(() => {
            root.click();
        });

        const next = screen.getByTestId("2");
        expect(next).toBeInTheDocument();
    });

    it("should move to next step when move next is called with branch key", () => {
        const MOCK_STEP: Step = {
            type: "branched-step",
            component: props => <MockBranchedStep {...props} id="1" nextId="2" />,
            branches: {
                "2": {
                    type: "normal-step",
                    component: props => <MockStep {...props} id="2" />,
                },
            },
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <Stepper step={MOCK_STEP} />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("1");
        expect(root).toBeInTheDocument();

        act(() => {
            root.click();
        });

        const next = screen.getByTestId("2");
        expect(next).toBeInTheDocument();
    });

    it("should throw error when next step is not found", () => {
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        const MOCK_STEP: Step = {
            type: "normal-step",
            component: props => <MockStep {...props} id="1" />,
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <Stepper step={MOCK_STEP} />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("1");
        expect(root).toBeInTheDocument();

        expect(() => {
            act(() => {
                root.click();
            });
        }).toThrowError("Next step is not defined");

        errorSpy.mockRestore();
    });
});
