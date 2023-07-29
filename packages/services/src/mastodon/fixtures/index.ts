import { mastodon } from "masto";

type Status = mastodon.v1.Status;

const BASE_MASTODON_POST: Status = {
    application: {
        name: "mastodon",
    },
    id: "1",
    createdAt: "2023-07-29T11:31:55.000Z",
    sensitive: true,
    spoilerText: "__MOCK_SPOILER_TEXT__",
    visibility: "unlisted",
    language: "ko",
    uri: "",
    url: "",
    repliesCount: 0,
    reblogsCount: 0,
    favouritesCount: 0,
    editedAt: null,
    favourited: false,
    reblogged: false,
    muted: false,
    bookmarked: false,
    content: "<span>MOCK_CONTENT</span>",
    filtered: [],
    reblog: null,
    account: {
        roles: [],
        id: "1",
        username: "__MOCK_USER__",
        acct: "__MOCK_USER__@example.com",
        displayName: "__MOCK_USER_NAME__",
        locked: false,
        bot: false,
        discoverable: true,
        createdAt: "2023-07-11T00:00:00.000Z",
        note: "",
        url: "https://example.com/@__MOCK_USER__",
        avatar: "",
        avatarStatic: "",
        header: "",
        headerStatic: "",
        followersCount: 1,
        followingCount: 1,
        statusesCount: 1,
        lastStatusAt: "2023-07-29",
        emojis: [],
        fields: [],
    },
    mediaAttachments: [
        {
            id: "1",
            type: "image",
            previewUrl: "previewUrl",
            meta: {
                original: {
                    width: 100,
                    height: 100,
                    aspect: 1,
                    size: "100",
                },
            },
        },
    ],
    mentions: [],
    tags: [],
    emojis: [],
    card: null,
    poll: null,
};

const BASE_MASTODON_NOTIFICATION: mastodon.v1.Notification = {
    id: "81227",
    type: "favourite",
    createdAt: "2023-07-29T08:48:05.417Z",
    account: {
        roles: [],
        id: "1",
        username: "__MOCK_USER__",
        acct: "__MOCK_USER__@example.com",
        displayName: "__MOCK_USER_NAME__",
        locked: false,
        bot: false,
        discoverable: true,
        createdAt: "2023-07-11T00:00:00.000Z",
        note: "",
        url: "https://example.com/@__MOCK_USER__",
        avatar: "",
        avatarStatic: "",
        header: "",
        headerStatic: "",
        followersCount: 1,
        followingCount: 1,
        statusesCount: 1,
        lastStatusAt: "2023-07-29",
        emojis: [],
        fields: [],
    },
};

export function createMastodonPost(id: string, reblog?: Status, replyTo?: Status): Status {
    return {
        ...BASE_MASTODON_POST,
        id,
        account: {
            ...BASE_MASTODON_POST.account,
            id: `user_${id}`,
            username: `user_${id}`,
            displayName: `user_${id}`,
        },
        reblog,
        reblogged: !!reblog,
        inReplyToId: replyTo?.id,
        inReplyToAccountId: replyTo?.account?.id,
    };
}

export function createMastodonNotification(
    id: string,
    type: mastodon.v1.NotificationType,
    status?: Status,
): mastodon.v1.Notification {
    return {
        ...BASE_MASTODON_NOTIFICATION,
        id,
        type,
        account: {
            ...BASE_MASTODON_NOTIFICATION.account,
            id: `user_${id}`,
            username: `user_${id}`,
            displayName: `user_${id}`,
        },
        status,
    };
}
