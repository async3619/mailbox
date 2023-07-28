import { withStep } from "@components/Stepper/withStep";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";

describe("withStep()", () => {
    it("should create wrapped component with correct display name", () => {
        const MockComponent = () => null;
        const WrappedComponent = withStep()(MockComponent);

        expect(WrappedComponent.displayName).toBe("WithStep(MockComponent)");
    });

    it("should pass props to wrapped component", () => {
        const onCompleteHandler = jest.fn();
        const moveNextHandler = jest.fn();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const MockComponent = ({ onComplete, moveNext }: Record<string, any>) => (
            <>
                <span data-testid="onComplete">{onComplete === onCompleteHandler ? "true" : "false"}</span>
                <span data-testid="moveNext">{moveNext === moveNextHandler ? "true" : "false"}</span>
            </>
        );
        const WrappedComponent = withStep()(MockComponent);

        render(
            <ThemeProvider theme={theme}>
                <WrappedComponent
                    step={{ type: "normal-step", component: () => null }}
                    onComplete={onCompleteHandler}
                    moveNext={moveNextHandler}
                />
            </ThemeProvider>,
        );

        expect(screen.getByTestId("onComplete")).toHaveTextContent("true");
        expect(screen.getByTestId("moveNext")).toHaveTextContent("true");
    });
});
