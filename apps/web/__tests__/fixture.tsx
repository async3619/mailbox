import dayjs from "dayjs";
import { NotificationItem, PostAttachment, PostAuthor, TimelinePost, TimelineType } from "services";
import { ColumnInstance, ColumnSize, ImagePreviewSize, SensitiveBlurring } from "@components/Column/types";
import { BaseStepProps } from "@components/Stepper/BaseStep";
import { BranchedStep, NormalStep } from "@components/Stepper/types";
import { withStep } from "@components/Stepper/withStep";

export const MOCK_ACCOUNT: PostAuthor = {
    avatarUrl: "",
    accountName: "test",
    accountId: "test",
    instanceUrl: "example.com",
};

export const MOCK_TIMELINE_POST: TimelinePost = {
    id: "1",
    author: MOCK_ACCOUNT,
    content: [{ type: "text", text: "test" }],
    attachments: [],
    createdAt: dayjs(),
    serviceType: "test",
    sensitive: false,
};
export const MOCK_REPOSTED_TIMELINE_POST: TimelinePost = {
    ...MOCK_TIMELINE_POST,
    repostedBy: MOCK_TIMELINE_POST.author,
};
export const MOCK_REPLIED_TIMELINE_POST: TimelinePost = {
    ...MOCK_TIMELINE_POST,
    originPostAuthor: MOCK_TIMELINE_POST.author,
};
export const MOCK_SPOILER_TIMELINE_POST: TimelinePost = {
    ...MOCK_TIMELINE_POST,
    spoilerText: "test",
};
export const MOCK_TIMELINE_POSTS: TimelinePost[] = [MOCK_TIMELINE_POST];

export const MOCK_ATTACHMENT: PostAttachment = {
    type: "image",
    url: "https://example.com/image.png",
    previewUrl: "https://example.com/image.png",
};
export const MOCK_VIDEO_ATTACHMENT: PostAttachment = {
    type: "video",
    url: "https://example.com/video.mp4",
    previewUrl: "https://example.com/video.png",
};
export const MOCK_GIF_ATTACHMENT: PostAttachment = {
    type: "gifv",
    url: "https://example.com/video.gif",
    previewUrl: "https://example.com/video.png",
};

export const MOCK_NOTIFICATION: NotificationItem = {
    type: "follow",
    id: "1",
    createdAt: dayjs(),
    users: [MOCK_ACCOUNT],
};
export const MOCK_FAVOURITE_NOTIFICATION: NotificationItem = {
    type: "favourite",
    id: "1",
    createdAt: dayjs(),
    users: [MOCK_ACCOUNT],
    post: MOCK_TIMELINE_POST,
};
export const MOCK_REBLOG_NOTIFICATION: NotificationItem = {
    ...MOCK_FAVOURITE_NOTIFICATION,
    type: "reblog",
};
export const MOCK_MENTION_NOTIFICATION: NotificationItem = {
    ...MOCK_FAVOURITE_NOTIFICATION,
    type: "mention",
};
export const MOCK_POLL_NOTIFICATION: NotificationItem = {
    ...MOCK_FAVOURITE_NOTIFICATION,
    type: "poll",
};

export const MOCK_COLUMN: ColumnInstance = {
    type: "timeline",
    id: "",
    accountId: "",
    sensitiveBlurring: SensitiveBlurring.WithBlur,
    timelineType: TimelineType.Home,
    size: ColumnSize.Small,
    title: "",
    imagePreviewSize: ImagePreviewSize.Original,
};

interface MockStepProps extends BaseStepProps<NormalStep> {
    id: string;
}
interface MockBranchedStepProps extends BaseStepProps<BranchedStep<string>> {
    id: string;
    nextId: string;
}

export const MockStep = withStep<NormalStep>()(({ moveNext, id }: MockStepProps) => {
    return (
        <button data-testid={id} onClick={moveNext}>
            Next
        </button>
    );
});
export const MockBranchedStep = withStep<BranchedStep<string>>()(({ moveNext, id, nextId }: MockBranchedStepProps) => {
    return (
        <button data-testid={id} onClick={() => moveNext(nextId)}>
            Next
        </button>
    );
});
