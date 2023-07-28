import _ from "lodash";

import { NotificationItem } from "../types";

export function composeNotifications(items: NotificationItem[]): NotificationItem[] {
    const excludeIndices: number[] = [];
    const composedNotifications: NotificationItem[][] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const composedItems: NotificationItem[] = [item];
        if (item.type === "mention" || item.type === "poll") {
            composedNotifications.push(composedItems);
            continue;
        }

        if (excludeIndices.includes(i)) {
            continue;
        }

        for (let j = i + 1; j < items.length; j++) {
            if (excludeIndices.includes(j)) {
                continue;
            }

            const targetItem = items[j];
            if (item.type !== targetItem.type) {
                break;
            }

            excludeIndices.push(j);
            if (item.type === "follow") {
                composedItems.push(targetItem);
            }

            if (
                (item.type === "reblog" || item.type === "favourite") &&
                (targetItem.type === "reblog" || targetItem.type === "favourite")
            ) {
                if (item.post.id !== targetItem.post.id) {
                    continue;
                }

                composedItems.push(targetItem);
            }
        }

        composedNotifications.push(composedItems);
    }

    return composedNotifications.map(items => ({
        ...items[0],
        id: items[0].id,
        users: _.chain(items).map("users").flatten().uniqBy("accountId").value(),
    }));
}
