import { PostTimelineType } from "@services/types";

export enum ColumnSize {
    Small = "small",
    Medium = "medium",
    Large = "large",
}
export enum ImagePreviewSize {
    Original = "original",
    Rectangle = "rectangle",
}
export enum SensitiveBlurring {
    WithBlur = "withBlur",
    WithoutBlur = "withoutBlur",
}

export interface BaseColumnInstance {
    id: string;
    title: string;
    size: ColumnSize;
    imagePreviewSize: ImagePreviewSize;
    sensitiveBlurring: SensitiveBlurring;
}

export interface TimelineColumnInstance extends BaseColumnInstance {
    type: "timeline";
    accountId: string;
    timelineType: PostTimelineType;
}

export interface NotificationColumnInstance extends BaseColumnInstance {
    type: "notification";
    accountId: string;
}

export type ColumnInstance = TimelineColumnInstance | NotificationColumnInstance;
export type RawColumnInstance = Omit<TimelineColumnInstance, "id"> | Omit<NotificationColumnInstance, "id">;
