import React from "react";

import { ThemeProvider } from "@mui/material";
import { act, render, screen } from "@testing-library/react";

import { EmojiContext } from "@components/Emoji/context";
import { EmojiText } from "@components/Emoji/Text";

import { theme } from "@styles/theme";

describe("<EmojiText />", () => {
    it("should render EmojiText properly", async () => {
        const parse = jest.fn().mockResolvedValue({});

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <EmojiContext.Provider value={{ loading: false, parse }}>
                        <EmojiText instanceUrl="social.silicon.moe">test</EmojiText>
                    </EmojiContext.Provider>
                </ThemeProvider>,
            );
        });

        const root = screen.getByText("test");
        expect(root).toBeInTheDocument();
    });

    it("should render EmojiText properly with no instanceUrl", async () => {
        const parse = jest.fn().mockResolvedValue({});

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <EmojiContext.Provider value={{ loading: false, parse }}>
                        <EmojiText>test</EmojiText>
                    </EmojiContext.Provider>
                </ThemeProvider>,
            );
        });

        const root = screen.getByText("test");
        expect(root).toBeInTheDocument();
    });

    it("should call emoji manager parse function on mount", async () => {
        const parse = jest.fn().mockResolvedValue({});

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <EmojiContext.Provider value={{ loading: false, parse }}>
                        <EmojiText instanceUrl="social.silicon.moe">:test:</EmojiText>
                    </EmojiContext.Provider>
                </ThemeProvider>,
            );
        });

        expect(parse).toBeCalledTimes(1);
    });

    it("should render placeholder if emoji is not found", async () => {
        const parse = jest.fn().mockResolvedValue({});

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <EmojiContext.Provider value={{ loading: false, parse }}>
                        <EmojiText instanceUrl="social.silicon.moe">:test:</EmojiText>
                    </EmojiContext.Provider>
                </ThemeProvider>,
            );
        });

        const root = screen.getByText("⬚");
        expect(root).toBeInTheDocument();
    });

    it("should render emoji if emoji is found", async () => {
        const parse = jest.fn().mockResolvedValue({
            test: {
                url: "https://social.silicon.moe/emoji/test",
                code: "test",
            },
        });

        await act(async () => {
            render(
                <ThemeProvider theme={theme}>
                    <EmojiContext.Provider value={{ loading: false, parse }}>
                        <EmojiText instanceUrl="social.silicon.moe">:test:</EmojiText>
                    </EmojiContext.Provider>
                </ThemeProvider>,
            );
        });

        const root = screen.getByTitle("test");
        expect(root).toBeInTheDocument();
    });
});
