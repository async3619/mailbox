import React from "react";

import { BaseColumn } from "@components/Column/Base";
import { NotificationColumnInstance } from "@components/Column/types";
import { TimelineSubscription } from "@components/TimelineSubscription";
import { TimelineType } from "@services/types";
import { useAccount } from "@states/accounts";
import { NotificationView } from "@components/Timeline/NotificationView";
import { VirtualizedList } from "@components/VirtualizedList";

export interface NotificationColumnProps {
    instance: NotificationColumnInstance;
}

export function NotificationColumn({ instance }: NotificationColumnProps) {
    const { accountId } = instance;
    const account = useAccount(accountId);
    const [scrollPosition, setScrollPosition] = React.useState(0);

    if (!account) {
        return null;
    }

    return (
        <TimelineSubscription
            loadMore
            type={TimelineType.Notifications}
            account={account}
            shouldTrim={scrollPosition === 0}
        >
            {(items, loading, loadMore) => (
                <BaseColumn loading={loading} instance={instance} onScroll={setScrollPosition}>
                    {view => (
                        <VirtualizedList
                            scrollElement={view}
                            onLoadMore={loadMore}
                            items={items}
                            getItemKey={item => item.id}
                            defaultHeight={200}
                        >
                            {item => <NotificationView notification={item} />}
                        </VirtualizedList>
                    )}
                </BaseColumn>
            )}
        </TimelineSubscription>
    );
}
