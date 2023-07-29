import dayjs from "dayjs";
import { PostContentItem } from "content-parser";

export type Nullable<T> = T | null | undefined;

export enum TimelineType {
    Home = "home",
    Local = "local",
    Federated = "fed",
    Notifications = "notifications",
}

export type PostTimelineType = Exclude<TimelineType, TimelineType.Notifications>;

export interface PostAttachment {
    type: "image" | "video" | "gifv" | "audio" | "unknown";
    url: Nullable<string>;
    previewUrl: Nullable<string>;
    width?: number;
    height?: number;
}
export interface PostAuthor {
    avatarUrl: string;
    accountName: string;
    accountId: string;
    instanceUrl: string;
}

export interface TimelinePost {
    serviceType: string;
    id: string;
    title?: string;
    content: PostContentItem[];
    author: PostAuthor;
    createdAt: dayjs.Dayjs;
    sensitive: boolean;
    attachments: PostAttachment[];
    instanceUrl?: string;
    repostedBy?: PostAuthor;
    originPostAuthor?: Nullable<PostAuthor>;
    spoilerText?: string;
}

export interface BaseNotificationItem {
    id: string;
    createdAt: dayjs.Dayjs;
    users: PostAuthor[];
    lastId?: string;
}

export interface PostNotificationItem extends BaseNotificationItem {
    type: "favourite" | "reblog" | "mention" | "poll";
    post: TimelinePost;
}
export interface FollowNotificationItem extends BaseNotificationItem {
    type: "follow";
}

export type NotificationItem = PostNotificationItem | FollowNotificationItem;
