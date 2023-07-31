import { MastodonAccount } from "./account";
import { createMastodonNotification, createMastodonPost } from "./fixtures";
import { NotificationItem, TimelinePost, TimelineType } from "../types";

jest.mock("masto", () => ({
    login: jest.fn().mockResolvedValue({
        v1: {
            accounts: {
                verifyCredentials: jest.fn().mockResolvedValue({
                    username: "username",
                    displayName: "displayName",
                    avatar: "avatar",
                }),
            },
            statuses: {
                reblog: jest.fn().mockImplementation(() => Promise.resolve(createMastodonPost("1"))),
                unreblog: jest.fn().mockImplementation(() => Promise.resolve(createMastodonPost("1"))),
            },
        },
    }),
}));

describe("MastodonAccount class", () => {
    let account: MastodonAccount;
    let fetchTimelineItems: jest.Mock;
    let fetchNotificationItems: jest.Mock;

    let onStreamUser: jest.Mock;
    let onStreamCommunityTimeline: jest.Mock;
    let onStreamPublicTimeline: jest.Mock;

    let disconnectStreamUser: jest.Mock;

    beforeEach(async () => {
        fetchTimelineItems = jest.fn().mockResolvedValue([]);
        fetchNotificationItems = jest.fn().mockResolvedValue([]);

        account = await MastodonAccount.create("instanceUrl", {
            access_token: "",
            token_type: "",
            scope: "",
            created_at: 0,
        });

        Object.defineProperty(account, "fetchTimelineItems", { value: fetchTimelineItems });
        Object.defineProperty(account, "fetchNotificationItems", { value: fetchNotificationItems });

        onStreamUser = jest.fn();
        onStreamCommunityTimeline = jest.fn();
        onStreamPublicTimeline = jest.fn();
        disconnectStreamUser = jest.fn();

        Object.defineProperty(account["client"].v1, "stream", {
            configurable: true,
            value: {
                streamUser: jest.fn().mockResolvedValue({ on: onStreamUser, disconnect: disconnectStreamUser }),
                streamCommunityTimeline: jest.fn().mockResolvedValue({ on: onStreamCommunityTimeline }),
                streamPublicTimeline: jest.fn().mockResolvedValue({ on: onStreamPublicTimeline }),
            },
        });
    });

    it("should be able to get unique id", () => {
        expect(account.getUniqueId()).toBe("@username@instanceUrl");
    });
    it("should be able to get user id", () => {
        expect(account.getUserId()).toBe("username");
    });
    it("should be able to get display name", () => {
        expect(account.getDisplayName()).toBe("displayName");
    });
    it("should be able to get avatar url", () => {
        expect(account.getAvatarUrl()).toBe("avatar");
    });
    it("should be able to get instance url", () => {
        expect(account.getInstanceUrl()).toBe("instanceUrl");
    });

    it("should be able to fetch home timeline items", async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of account.getTimelinePosts(TimelineType.Home, 10)) {
        }

        expect(fetchTimelineItems).toBeCalledTimes(1);
        expect(fetchTimelineItems).toBeCalledWith(TimelineType.Home, 10, undefined);
    });
    it("should be able to fetch local timeline items", async () => {
        fetchTimelineItems.mockResolvedValue([]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of account.getTimelinePosts(TimelineType.Local, 10)) {
        }

        expect(fetchTimelineItems).toBeCalledTimes(1);
        expect(fetchTimelineItems).toBeCalledWith(TimelineType.Local, 10, undefined);
    });
    it("should be able to fetch federated timeline items", async () => {
        fetchTimelineItems.mockResolvedValue([]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of account.getTimelinePosts(TimelineType.Federated, 10)) {
        }

        expect(fetchTimelineItems).toBeCalledTimes(1);
        expect(fetchTimelineItems).toBeCalledWith(TimelineType.Federated, 10, undefined);
    });

    it("should compose post data correctly", async () => {
        fetchTimelineItems.mockResolvedValueOnce([createMastodonPost("1")]);

        const result: TimelinePost[] = [];
        for await (const items of account.getTimelinePosts(TimelineType.Home, 10)) {
            result.push(...items);
        }

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ id: "1" });
    });
    it("should compose reposted post data correctly", async () => {
        fetchTimelineItems.mockResolvedValueOnce([createMastodonPost("2", createMastodonPost("1"))]);

        const result: TimelinePost[] = [];
        for await (const items of account.getTimelinePosts(TimelineType.Home, 10)) {
            result.push(...items);
        }

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            id: "2",
            repostedBy: expect.objectContaining({
                accountName: "user_2",
            }),
        });
    });
    it("should compose replied post data correctly", async () => {
        fetchTimelineItems.mockResolvedValueOnce([
            createMastodonPost("1"),
            createMastodonPost("2", undefined, createMastodonPost("1")),
        ]);

        const result: TimelinePost[] = [];
        for await (const items of account.getTimelinePosts(TimelineType.Home, 10)) {
            result.push(...items);
        }

        expect(result).toHaveLength(2);
        expect(result[1]).toMatchObject({
            id: "2",
            originPostAuthor: expect.objectContaining({
                accountName: "user_1",
            }),
            author: expect.objectContaining({
                accountName: "user_2",
            }),
        });
    });
    it("should use cached user data for replied post author", async () => {
        fetchTimelineItems
            .mockResolvedValueOnce([createMastodonPost("1")])
            .mockResolvedValueOnce([createMastodonPost("2", undefined, createMastodonPost("1"))]);

        const result: TimelinePost[] = [];
        for await (const items of account.getTimelinePosts(TimelineType.Home, 10)) {
            result.push(...items);
        }

        expect(result).toHaveLength(2);
        expect(result[0].author).toEqual(result[1].originPostAuthor);
    });
    it("should cache reposted post for later use", async () => {
        fetchTimelineItems.mockResolvedValueOnce([createMastodonPost("2", createMastodonPost("1"))]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of account.getTimelinePosts(TimelineType.Home, 10)) {
        }

        expect(account["reblogIds"].has("1")).toBe(true);
    });
    it("should throw error if fetched post is not a valid post data", async () => {
        fetchTimelineItems.mockResolvedValueOnce([
            {
                ...createMastodonPost("1"),
                account: { url: "" },
            },
        ]);

        expect(async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for await (const _ of account.getTimelinePosts(TimelineType.Home, 10)) {
            }
        }).rejects.toThrowError("Invalid post data");
    });

    it("should be able to fetch notification items", async () => {
        fetchTimelineItems.mockResolvedValue([]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of account.getNotificationItems(10)) {
        }

        expect(fetchNotificationItems).toBeCalledTimes(1);
        expect(fetchNotificationItems).toBeCalledWith(10, undefined);
    });
    it("should truncate notification items with limit", async () => {
        fetchNotificationItems.mockResolvedValueOnce([
            createMastodonNotification("1", "favourite", createMastodonPost("1")),
            createMastodonNotification("2", "reblog", createMastodonPost("2")),
            createMastodonNotification("3", "mention", createMastodonPost("3")),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of account.getNotificationItems(1)) {
        }

        expect(fetchNotificationItems).toBeCalledTimes(2);
        expect(fetchNotificationItems).toBeCalledWith(1, undefined);
    });
    it("should try to fetch more notification items if limit is not reached", async () => {
        fetchNotificationItems
            .mockResolvedValueOnce([createMastodonNotification("1", "favourite", createMastodonPost("1"))])
            .mockResolvedValueOnce([createMastodonNotification("2", "reblog", createMastodonPost("2"))])
            .mockResolvedValueOnce([createMastodonNotification("3", "mention", createMastodonPost("3"))]);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of account.getNotificationItems(3)) {
        }

        expect(fetchNotificationItems).toBeCalledTimes(5);
        expect(fetchNotificationItems).toHaveBeenNthCalledWith(1, 3, undefined);
        expect(fetchNotificationItems).toHaveBeenNthCalledWith(2, 3, "1");
        expect(fetchNotificationItems).toHaveBeenNthCalledWith(3, 3, "2");
    });
    it("should compose notification data with post correctly", async () => {
        fetchNotificationItems.mockResolvedValueOnce([
            createMastodonNotification("1", "favourite", createMastodonPost("1")),
            createMastodonNotification("2", "reblog", createMastodonPost("2")),
            createMastodonNotification("3", "mention", createMastodonPost("3")),
            createMastodonNotification("4", "poll", createMastodonPost("4")),
        ]);

        const result: NotificationItem[] = [];
        for await (const items of account.getNotificationItems(10)) {
            result.push(...items);
        }

        expect(result).toHaveLength(4);
        expect(result[0]).toMatchObject({
            id: "1",
            type: "favourite",
            post: expect.objectContaining({ id: "1" }),
            users: expect.arrayContaining([expect.objectContaining({ accountName: "user_1" })]),
        });
        expect(result[1]).toMatchObject({
            id: "2",
            type: "reblog",
            post: expect.objectContaining({ id: "2" }),
            users: expect.arrayContaining([expect.objectContaining({ accountName: "user_2" })]),
        });
        expect(result[2]).toMatchObject({
            id: "3",
            type: "mention",
            post: expect.objectContaining({ id: "3" }),
            users: expect.arrayContaining([expect.objectContaining({ accountName: "user_3" })]),
        });
        expect(result[3]).toMatchObject({
            id: "4",
            type: "poll",
            post: expect.objectContaining({ id: "4" }),
            users: expect.arrayContaining([expect.objectContaining({ accountName: "user_4" })]),
        });
    });
    it("should throw error when trying to compose notification data without post data", async () => {
        fetchNotificationItems.mockResolvedValueOnce([
            { ...createMastodonNotification("1", "favourite", createMastodonPost("1")), status: null },
        ]);

        expect(async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for await (const _ of account.getNotificationItems(10)) {
            }
        }).rejects.toThrowError("Invalid notification data");
    });
    it("should compose follow notification data correctly", async () => {
        fetchNotificationItems.mockResolvedValueOnce([createMastodonNotification("1", "follow")]);

        const result: NotificationItem[] = [];
        for await (const items of account.getNotificationItems(10)) {
            result.push(...items);
        }

        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            id: "1",
            type: "follow",
            users: expect.arrayContaining([expect.objectContaining({ accountName: "user_1" })]),
        });
    });
    it("should throw error when trying to compose unknown notification type", async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetchNotificationItems.mockResolvedValueOnce([createMastodonNotification("1", "unknown" as any)]);

        expect(async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for await (const _ of account.getNotificationItems(10)) {
            }
        }).rejects.toThrowError("Invalid notification type: unknown");
    });

    it("should able to start watching home timeline", async () => {
        await account.startWatch(TimelineType.Home);

        expect(account["client"].v1.stream.streamUser).toBeCalledTimes(1);
        expect(onStreamUser).toBeCalledTimes(3);
    });
    it("should able to start watching local timeline", async () => {
        await account.startWatch(TimelineType.Local);

        expect(account["client"].v1.stream.streamCommunityTimeline).toBeCalledTimes(1);
        expect(onStreamCommunityTimeline).toBeCalledTimes(3);
    });
    it("should able to start watching public timeline", async () => {
        await account.startWatch(TimelineType.Federated);

        expect(account["client"].v1.stream.streamPublicTimeline).toBeCalledTimes(1);
        expect(onStreamPublicTimeline).toBeCalledTimes(3);
    });
    it("should able to start watching notifications", async () => {
        await account.startWatch(TimelineType.Notifications);

        expect(account["client"].v1.stream.streamUser).toBeCalledTimes(1);
        expect(onStreamUser).toBeCalledTimes(4);
    });

    it("should not open multiple streams on same timeline type", async () => {
        await account.startWatch(TimelineType.Home);
        await account.startWatch(TimelineType.Home);

        expect(account["client"].v1.stream.streamUser).toBeCalledTimes(1);
        expect(onStreamUser).toBeCalledTimes(3);
    });
    it("should able to stop watching timeline", async () => {
        await account.startWatch(TimelineType.Home);
        await account.stopWatch(TimelineType.Home);

        expect(disconnectStreamUser).toBeCalledTimes(1);
    });

    it("should be able too serialize account data", () => {
        expect(account.serialize()).toEqual({
            serviceType: "mastodon",
            instanceUrl: "instanceUrl",
            token: { access_token: "", token_type: "", scope: "", created_at: 0 },
        });
    });

    it("should be able to repost a post", async () => {
        const targetPost = createMastodonPost("1");
        const composedPost = account["composePost"](targetPost);

        await account.repost(composedPost);

        expect(account["client"].v1.statuses.reblog).toBeCalledTimes(1);
        expect(account["client"].v1.statuses.reblog).toBeCalledWith("1");
    });
    it("should be able to cancel reposting a post", async () => {
        const targetPost = createMastodonPost("1");
        const composedPost = account["composePost"](targetPost);

        await account.cancelRepost(composedPost);

        expect(account["client"].v1.statuses.unreblog).toBeCalledTimes(1);
        expect(account["client"].v1.statuses.unreblog).toBeCalledWith("1");
    });
});
