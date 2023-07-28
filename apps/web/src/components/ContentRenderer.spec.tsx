/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";

import { ContentRenderer } from "./ContentRenderer";
import { createTheme, ThemeProvider } from "@mui/material";
import { EmojiContext } from "./Emoji/context";

describe("<ContentRenderer />", () => {
    let consoleError: jest.SpyInstance;

    beforeAll(() => {
        consoleError = jest.spyOn(console, "error").mockImplementation(jest.fn());
    });

    afterAll(() => {
        consoleError.mockRestore();
    });

    it("should render ContentRenderer properly", () => {
        render(<ContentRenderer content={[]} />);

        const root = screen.getByTestId("content-renderer");
        expect(root).toBeInTheDocument();
    });

    it("should render paragraph item properly", () => {
        render(
            <ContentRenderer
                content={[
                    {
                        type: "paragraph",
                        children: [{ type: "text", text: "MOCK_TEXT" }],
                    },
                ]}
            />,
        );

        const text = screen.getByText("MOCK_TEXT");
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent("MOCK_TEXT");
        expect(text.tagName).toBe("P");
    });

    it("should render span item properly", () => {
        render(
            <ContentRenderer
                content={[
                    {
                        type: "span",
                        children: [{ type: "text", text: "MOCK_TEXT" }],
                    },
                ]}
            />,
        );

        const text = screen.getByText("MOCK_TEXT");
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent("MOCK_TEXT");
        expect(text.tagName).toBe("SPAN");
    });

    it("should throw error if unknown content type is given", () => {
        expect(() => {
            render(
                <ContentRenderer
                    content={[
                        {
                            type: "unknown" as any,
                            children: [{ type: "text", text: "MOCK_TEXT" }],
                        },
                    ]}
                />,
            );
        }).toThrowError("Unknown content type: unknown");
    });

    it("should render emoji item properly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <EmojiContext.Provider value={{} as any}>
                    <ContentRenderer content={[{ type: "emoji", code: "MOCK_CODE" }]} />
                </EmojiContext.Provider>
            </ThemeProvider>,
        );

        const text = screen.getByText(":MOCK_CODE:");
        expect(text).toBeInTheDocument();
    });

    it("should render text item properly", () => {
        render(<ContentRenderer content={[{ type: "text", text: "MOCK_TEXT" }]} />);

        const text = screen.getByText("MOCK_TEXT");
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent("MOCK_TEXT");
    });

    it("should render break-line item properly", () => {
        const context = render(<ContentRenderer content={[{ type: "break-line" }]} />);
        const br = context.container.querySelector("br");

        expect(br).toBeInTheDocument();
    });

    it("should render hash-tag item properly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <ContentRenderer content={[{ type: "hash-tag", tag: "MOCK_TAG" }]} />
            </ThemeProvider>,
        );

        const link = screen.getByText("#MOCK_TAG");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/u/MOCK_TAG");
    });

    it("should render mention item properly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <ContentRenderer
                    content={[{ type: "mention", accountId: "MOCK_ACCOUNT_ID", instanceUrl: "MOCK_INSTANCE_URL" }]}
                />
            </ThemeProvider>,
        );

        const link = screen.getByText("MOCK_ACCOUNT_ID");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/u/MOCK_INSTANCE_URL");
    });

    it("should render link item properly", () => {
        render(
            <ThemeProvider theme={createTheme()}>
                <ContentRenderer
                    content={[
                        {
                            type: "link",
                            url: "MOCK_URL",
                            content: "MOCK_CONTENT",
                        },
                    ]}
                />
                ,
            </ThemeProvider>,
        );

        const link = screen.getByText("MOCK_CONTENT");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "MOCK_URL");
    });

    it("should throw error if unknown content type is given", () => {
        expect(() => {
            render(<ContentRenderer content={[{ type: "unknown" as any }]} />);
        }).toThrowError("Unknown content type: unknown");
    });
});
