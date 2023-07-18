import { PostContentItem } from "../types";

export type ParseItemPair = [string, PostContentItem[]];

export const POST_CONTENT_TEST_CASES: ParseItemPair[] = [
    // with Paragraph
    [`<p>Test</p>`, [{ type: "paragraph", children: [{ type: "text", text: "Test" }] }]],

    // with Span in Paragraph
    [
        `<p><span>Test</span></p>`,
        [{ type: "paragraph", children: [{ type: "span", children: [{ type: "text", text: "Test" }] }] }],
    ],

    // Break line
    [`<br />`, [{ type: "break-line" }]],

    // Anchor
    [
        `<a href="https://google.com">google.com</a>`,
        [{ type: "link", url: "https://google.com", content: "google.com" }],
    ],

    // Hashtags
    [
        `<a href="#" class="mention hashtag status-link">#<span>HashtagMock</span></a>`,
        [{ type: "hash-tag", tag: "HashtagMock" }],
    ],

    // Mensions
    [
        `<a href="https://social.silicon.moe/@sophia_dev" class="u-url mention status-link">@<span>sophia_dev</span></a>`,
        [
            {
                type: "mention",
                accountId: "@sophia_dev",
                instanceUrl: "social.silicon.moe",
            },
        ],
    ],
];
