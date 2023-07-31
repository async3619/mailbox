/* eslint-disable @typescript-eslint/no-empty-function */
import { AccountEventMap, BaseAccount, NotificationItem, TimelinePost, TimelineType } from "services";

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

    repost = jest.fn();
    cancelRepost = jest.fn();

    public serialize(): Record<string, unknown> {
        return {};
    }

    public async startWatch(): Promise<void> {}
    public async stopWatch(): Promise<void> {}

    emitEvent<K extends keyof AccountEventMap>(eventName: K, ...args: Parameters<AccountEventMap[K]>): void {
        this.emit(eventName, ...args);
    }
}
