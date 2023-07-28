import { MediaContext, MediaContextValues, useMedia } from ".";
import { render, screen } from "@testing-library/react";

describe("useMedia()", () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it("should throw an error if used outside of a <MediaProvider />", () => {
        function MockComponent() {
            useMedia();

            return null;
        }

        expect(() => render(<MockComponent />)).toThrow("useMediaContext must be used within a <MediaProvider />");
    });

    it("should be able to get current media context value", () => {
        const value: MediaContextValues = {
            openMediaViewer: jest.fn(),
            closeMediaViewer: jest.fn(),
        };

        function MockComponent() {
            const media = useMedia();

            return (
                <div data-testid="test">
                    {media.openMediaViewer === value.openMediaViewer &&
                    media.closeMediaViewer === value.closeMediaViewer
                        ? "true"
                        : "false"}
                </div>
            );
        }

        render(<MockComponent />, {
            wrapper: ({ children }) => <MediaContext.Provider value={value}>{children}</MediaContext.Provider>,
        });

        const test = screen.getByTestId("test");
        expect(test).toHaveTextContent("true");
    });
});
