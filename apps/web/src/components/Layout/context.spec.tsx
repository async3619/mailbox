import { render } from "@testing-library/react";
import { useLayout } from "@components/Layout/context";

describe("useLayout()", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(jest.fn());
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should throw an error if used outside of a <Layout />", () => {
        function MockComponent() {
            useLayout();
            return null;
        }

        expect(() => render(<MockComponent />)).toThrow("useLayout must be used within a LayoutProvider");
    });
});
