import { BaseAccount } from "@services/base/account";
import { NotificationItem, TimelinePost, TimelineType } from "@services/types";

export class TestAccount extends BaseAccount<string> {
    public constructor(private readonly userId = "__TEST__", serviceType = "test") {
        super(serviceType);
    }

    public getAvatarUrl(): string {
        return "";
    }
    public getDisplayName(): string {
        return "__DISPLAY_NAME__";
    }
    public getUniqueId(): string {
        return this.userId;
    }
    public getUserId(): string {
        return this.userId;
    }

    public async *getNotificationItems(): AsyncIterableIterator<NotificationItem[]> {
        return [];
    }
    public async *getTimelinePosts(): AsyncIterableIterator<TimelinePost[]> {
        return [];
    }

    public serialize(): Record<string, unknown> {
        return {};
    }

    public async startWatch(type: TimelineType): Promise<void> {}
    public async stopWatch(type: TimelineType): Promise<void> {}
}
