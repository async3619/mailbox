import { Nullable } from "@utils/types";
import dayjs from "dayjs";

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
}

export interface TimelinePost {
    serviceType: string;
    id: string;
    title?: string;
    content: string;
    author: PostAuthor;
    instanceUrl?: string;
    createdAt: dayjs.Dayjs;
    sensitive: boolean;
    attachments: PostAttachment[];
    repostedBy?: PostAuthor;
    originPostAuthor?: Nullable<PostAuthor>;
}
