export interface BaseColumnInstance {
    id: string;
    title: string;
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
