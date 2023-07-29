/* eslint-disable @typescript-eslint/no-empty-function */
import { BaseAccount } from "./account";
import { NotificationItem, TimelinePost } from "../types";
import { undefined } from "zod";

class MockAccount extends BaseAccount<"mock"> {
    constructor(serviceType: "mock") {
        super(serviceType);
    }
    getAvatarUrl(): string {
        return "";
    }
    getDisplayName(): string {
        return "";
    }
    async *getNotificationItems(): AsyncIterableIterator<NotificationItem[]> {
        return undefined;
    }
    async *getTimelinePosts(): AsyncIterableIterator<TimelinePost[]> {
        return undefined;
    }
    getUniqueId(): string {
        return "";
    }
    getUserId(): string {
        return "";
    }
    serialize(): Record<string, unknown> {
        return {};
    }
    async startWatch(): Promise<void> {}
    async stopWatch(): Promise<void> {}
}

describe("Account class", () => {
    it("should be able to get service type", () => {
        const account = new MockAccount("mock");

        expect(account.getServiceType()).toBe("mock");
    });
});
