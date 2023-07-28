import { createTheme, ThemeProvider } from "@mui/material";
import { act, render, screen } from "@testing-library/react";

import { Splash, useSplash } from "@components/Splash";

describe("<Splash />", () => {
    it("should render Splash correctly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <Splash />
            </ThemeProvider>,
        );
    });

    it("should render Splash with children correctly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <Splash>
                    <div>__TEST__</div>
                </Splash>
            </ThemeProvider>,
        );

        const text = screen.getByText("__TEST__");
        expect(text).toBeInTheDocument();
    });

    it("should have context for splash screen management", () => {
        const MockComponent = () => {
            const { hidden } = useSplash();

            return (
                <>
                    <div data-testid="hidden">{hidden ? "Hidden" : "Visible"}</div>
                </>
            );
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <Splash>
                    <MockComponent />
                </Splash>
            </ThemeProvider>,
        );

        const hidden = screen.getByTestId("hidden");
        expect(hidden).toHaveTextContent("Visible");
    });

    it("should hide splash screen if hide function is called", () => {
        const MockComponent = () => {
            const { hide, hidden } = useSplash();

            return (
                <>
                    <div data-testid="hide" onClick={hide} />
                    <div data-testid="hidden">{hidden ? "Hidden" : "Visible"}</div>
                </>
            );
        };

        render(
            <ThemeProvider theme={createTheme()}>
                <Splash>
                    <MockComponent />
                </Splash>
            </ThemeProvider>,
        );

        const hidden = screen.getByTestId("hidden");
        expect(hidden).toHaveTextContent("Visible");

        const hide = screen.getByTestId("hide");

        act(() => {
            hide.click();
        });

        expect(hidden).toHaveTextContent("Hidden");
    });

    it("should throw error if useSplash is used outside of Splash", () => {
        expect(() => useSplash()).toThrowError();
    });
});

describe("useSplash()", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(jest.fn());
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should throw error if useSplash is used outside of Splash", () => {
        function MockComponent() {
            useSplash();

            return null;
        }

        expect(() => render(<MockComponent />)).toThrow("useSplash must be used within a <Splash />");
    });
});
