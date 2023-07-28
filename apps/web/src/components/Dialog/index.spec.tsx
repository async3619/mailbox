import { render } from "@testing-library/react";

import { DialogContext, useDialog } from "./index";

describe("useDialog()", () => {
    let consoleError: jest.SpyInstance;

    beforeAll(() => {
        consoleError = jest.spyOn(console, "error").mockImplementation(jest.fn());
    });

    afterAll(() => {
        consoleError.mockRestore();
    });

    it("should return dialog context", () => {
        const data = {
            showDialog: jest.fn(),
            showBackdrop: jest.fn(),
            hideBackdrop: jest.fn(),
        };

        function MockComponent() {
            const context = useDialog();
            context.hideBackdrop();

            return null;
        }

        render(
            <DialogContext.Provider value={data}>
                <MockComponent />
            </DialogContext.Provider>,
        );

        expect(data.hideBackdrop).toBeCalledTimes(1);
    });

    it("should throw error if used outside of DialogProvider", () => {
        function MockComponent() {
            useDialog();

            return null;
        }

        expect(() => {
            render(<MockComponent />);
        }).toThrowError();
    });
});
