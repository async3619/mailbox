import { parsePostContent } from "./parsePostContent";

import { POST_CONTENT_TEST_CASES } from "./fixtures/post-contents";

describe("parsePostContent Function", () => {
    it("should parse post content properly", () => {
        for (const [html, parsed] of POST_CONTENT_TEST_CASES) {
            const parsedHtml = parsePostContent(html);

            expect(parsedHtml).toEqual(parsed);
        }
    });

    it("should parse emoji codes properly", () => {
        const parsedNodes = parsePostContent(":mocked_emoji1:");

        expect(parsedNodes).toEqual([{ type: "emoji", code: "mocked_emoji1" }]);
    });

    it("should add pre contents as text node if met custom emoji snippet", () => {
        const parsedNodes = parsePostContent("Mocked :mocked_emoji1:");

        expect(parsedNodes).toEqual([
            { type: "text", text: "Mocked " },
            { type: "emoji", code: "mocked_emoji1" },
        ]);
    });

    it("should add post contents as text node if met custom emoji snippet", () => {
        const parsedNodes = parsePostContent(":mocked_emoji1: Mocked");

        expect(parsedNodes).toEqual([
            { type: "emoji", code: "mocked_emoji1" },
            { type: "text", text: " Mocked" },
        ]);
    });

    it("should throw error if link is invalid", () => {
        expect(async () => parsePostContent('<a class="mention" href="">@</a>')).rejects.toThrowError(
            "Invalid mention link: href is empty.",
        );

        expect(async () => parsePostContent('<a href="">Test</a>')).rejects.toThrowError(
            "Invalid link: href is empty.",
        );
    });

    it("should throw error if unknown dom tags found", () => {
        expect(async () => parsePostContent("<center>center</center>")).rejects.toThrowError("Unknown element tag:");
    });
});
