import { PostAuthor, TimelinePost } from "../../types";
import dayjs from "dayjs";

export function createUser(id: string): PostAuthor {
    return {
        avatarUrl: "",
        accountName: "",
        instanceUrl: "",
        accountId: id,
    };
}

export function createPost(id: string, authorId: string): TimelinePost {
    return {
        id,
        spoilerText: "",
        instanceUrl: "",
        author: createUser(authorId),
        serviceType: "mastodon",
        content: [],
        attachments: [],
        createdAt: {} as dayjs.Dayjs,
        sensitive: false,
    };
}
