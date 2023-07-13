export enum ColumnSize {
    Small = "small",
    Medium = "medium",
    Large = "large",
}

export interface BaseColumnInstance {
    id: string;
    title: string;
    size: ColumnSize;
}

interface MastodonTimelineData {
    type: "mastodon";
    timelineType: "home" | "local" | "fed";
}

type TimelineData = MastodonTimelineData;

export interface TimelineColumnInstance extends BaseColumnInstance {
    type: "timeline";
    accountId: string;
    data: TimelineData;
}

export type ColumnInstance = TimelineColumnInstance;
