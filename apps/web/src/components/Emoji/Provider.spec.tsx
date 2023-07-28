import React from "react";

import { act, render, screen } from "@testing-library/react";
import { EmojiProvider } from "@components/Emoji/Provider";
import { useApolloClient } from "@apollo/client";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { EmojisDocument, EmojisQuery, InvalidateEmojisDocument, InvalidateEmojisMutation } from "@queries";
import { useEmojiManager } from "@components/Emoji/context";
import { CustomEmojiItem, Dictionary } from "@utils/types";

function Renderer({ children }: React.PropsWithChildren) {
    const client = useApolloClient();

    return <EmojiProvider client={client}>{children}</EmojiProvider>;
}

describe("<EmojiProvider />", () => {
    let emojisMock: MockedResponse<EmojisQuery>;
    let invalidateEmojisMock: MockedResponse<InvalidateEmojisMutation>;

    beforeEach(() => {
        emojisMock = {
            request: {
                query: EmojisDocument,
            },
            newData: jest.fn().mockReturnValue({
                data: {
                    emojis: [
                        { instance: "mastodon.social", emojis: [] },
                        {
                            instance: "social.silicon.moe",
                            emojis: [{ id: 1, code: "42", url: "", staticUrl: "" }],
                        },
                    ],
                },
            }),
            delay: 0,
        };

        invalidateEmojisMock = {
            request: {
                query: InvalidateEmojisDocument,
                variables: { instanceUrls: ["social.silicon.moe"] },
            },
            newData: jest.fn().mockReturnValue({
                data: {
                    invalidateEmojis: true,
                },
            }),
        };
    });

    it("should render EmojiProvider properly", async () => {
        act(() => {
            render(
                <MockedProvider addTypename={false} mocks={[emojisMock, invalidateEmojisMock]}>
                    <Renderer>
                        <div data-testid="root" />
                    </Renderer>
                </MockedProvider>,
            );
        });

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(screen.getByTestId("root")).toBeInTheDocument();
        expect(emojisMock.newData).toBeCalledTimes(1);
    });

    it("should be able to parse custom emojis from text", async () => {
        function MockedComponent() {
            const { parse } = useEmojiManager();
            const [parsedEmojis, setParsedEmojis] = React.useState<Dictionary<CustomEmojiItem>>({});

            return (
                <button
                    data-testid="button"
                    onClick={async () => setParsedEmojis(await parse("social.silicon.moe", "Hello :42:"))}
                >
                    {Object.entries(parsedEmojis).length}
                </button>
            );
        }

        await act(() => {
            return render(
                <MockedProvider addTypename={false} mocks={[emojisMock, invalidateEmojisMock]}>
                    <Renderer>
                        <MockedComponent />
                    </Renderer>
                </MockedProvider>,
            );
        });

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const button = screen.getByTestId("button");
        expect(button).toBeInTheDocument();

        await act(async () => {
            await button.click();
        });

        expect(button).toHaveTextContent("1");
    });

    it("should invalidate emoji cache if parsed emoji is not found", async () => {
        function MockedComponent() {
            const { parse } = useEmojiManager();

            return (
                <button data-testid="button" onClick={() => parse("social.silicon.moe", "Hello :not_found_emoji:")} />
            );
        }

        await act(() => {
            return render(
                <MockedProvider addTypename={false} mocks={[emojisMock, invalidateEmojisMock]}>
                    <Renderer>
                        <MockedComponent />
                    </Renderer>
                </MockedProvider>,
            );
        });

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const button = screen.getByTestId("button");
        expect(button).toBeInTheDocument();

        act(() => {
            button.click();
        });

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        });

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(invalidateEmojisMock.newData).toBeCalledTimes(1);
    });
});
