import { EmojiContext, EmojiContextValue, useEmojiManager } from "@components/Emoji/context";
import { render, screen } from "@testing-library/react";

describe("useEmojiManager()", () => {
    it("should return emoji manager", () => {
        const value: EmojiContextValue = {
            loading: false,
            parse: jest.fn(),
        };

        function TestComponent() {
            const emojiManager = useEmojiManager();

            return <div data-testid="root">{!emojiManager.loading ? "false" : "true"}</div>;
        }

        render(
            <EmojiContext.Provider value={value}>
                <TestComponent />
            </EmojiContext.Provider>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();
        expect(root).toHaveTextContent("false");
    });

    it("should throw error if useEmoji() is used within an <EmojiProvider />", () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(jest.fn());
        function TestComponent() {
            useEmojiManager();

            return <div data-testid="root" />;
        }

        expect(() => render(<TestComponent />)).toThrowError();
        consoleErrorSpy.mockRestore();
    });
});
