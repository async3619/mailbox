import { render, screen } from "@testing-library/react";

import { ColumnInstance } from "@components/Column/types";

import { ColumnContext, useColumn } from "./context";

describe("useColumn()", () => {
    it("should throw an error if used outside of a <BaseColumn />", () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(jest.fn());
        function MockComponent() {
            useColumn();

            return null;
        }

        expect(() => render(<MockComponent />)).toThrow("useColumn must be used within a <BaseColumn />");
        consoleErrorSpy.mockRestore();
    });

    it("should be able to get current column context value", () => {
        function MockComponent() {
            const column = useColumn();

            return <div data-testid="test">{column.id}</div>;
        }

        render(<MockComponent />, {
            wrapper: ({ children }) => (
                <ColumnContext.Provider value={{ column: { id: "1" } as ColumnInstance }}>
                    {children}
                </ColumnContext.Provider>
            ),
        });

        const test = screen.getByTestId("test");
        expect(test).toHaveTextContent("1");
    });
});
