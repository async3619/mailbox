import dayjs from "dayjs";

import { composeNotifications } from "./notifications";
import { createPost, createUser } from "./fixtures";

describe("composeNotifications()", () => {
    it("should be able to group follow notifications", () => {
        const data = composeNotifications([
            { id: "1", type: "follow", users: [createUser("1")], createdAt: {} as dayjs.Dayjs },
            { id: "2", type: "follow", users: [createUser("2")], createdAt: {} as dayjs.Dayjs },
        ]);

        expect(data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: "1",
                    type: "follow",
                    users: [createUser("1"), createUser("2")],
                }),
            ]),
        );
    });

    it("should be able to group reblog notifications", () => {
        const data = composeNotifications([
            {
                id: "1",
                type: "reblog",
                users: [createUser("1")],
                createdAt: {} as dayjs.Dayjs,
                post: createPost("1", "1"),
            },
            {
                id: "2",
                type: "reblog",
                users: [createUser("2")],
                createdAt: {} as dayjs.Dayjs,
                post: createPost("1", "1"),
            },
        ]);

        expect(data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: "1",
                    type: "reblog",
                    users: [createUser("1"), createUser("2")],
                }),
            ]),
        );
    });

    it("should be able to group favourite notifications", () => {
        const data = composeNotifications([
            {
                id: "1",
                type: "favourite",
                users: [createUser("1")],
                createdAt: {} as dayjs.Dayjs,
                post: createPost("1", "1"),
            },
            {
                id: "2",
                type: "favourite",
                users: [createUser("2")],
                createdAt: {} as dayjs.Dayjs,
                post: createPost("1", "1"),
            },
        ]);

        expect(data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: "1",
                    type: "favourite",
                    users: [createUser("1"), createUser("2")],
                }),
            ]),
        );
    });

    it("should not group mention notifications", () => {
        const createdAt = {} as dayjs.Dayjs;
        const data = composeNotifications([
            { id: "1", type: "mention", users: [createUser("1")], createdAt, post: createPost("1", "1") },
            { id: "2", type: "mention", users: [createUser("2")], createdAt, post: createPost("2", "2") },
        ]);

        expect(data).toEqual([
            expect.objectContaining({
                id: "1",
                type: "mention",
                users: [createUser("1")],
                post: createPost("1", "1"),
            }),
            expect.objectContaining({
                id: "2",
                type: "mention",
                users: [createUser("2")],
                post: createPost("2", "2"),
            }),
        ]);
    });

    it("should not group poll notifications", () => {
        const data = composeNotifications([
            {
                id: "1",
                type: "poll",
                users: [createUser("1")],
                createdAt: {} as dayjs.Dayjs,
                post: createPost("1", "1"),
            },
            {
                id: "2",
                type: "poll",
                users: [createUser("2")],
                createdAt: {} as dayjs.Dayjs,
                post: createPost("2", "2"),
            },
        ]);

        expect(data).toEqual([
            expect.objectContaining({
                id: "1",
                type: "poll",
                users: [createUser("1")],
                post: createPost("1", "1"),
            }),
            expect.objectContaining({
                id: "2",
                type: "poll",
                users: [createUser("2")],
                post: createPost("2", "2"),
            }),
        ]);
    });
});
