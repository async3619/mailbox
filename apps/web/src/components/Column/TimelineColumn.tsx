import React from "react";

import { Timeline } from "@components/Timeline";
import { TimelineColumnInstance } from "@components/Column/types";
import { BaseColumn } from "@components/Column/Base";

import { useAccount } from "@states/accounts";
import { TimelineSubscription } from "@components/TimelineSubscription";

export interface TimelineColumnProps {
    instance: TimelineColumnInstance;
}

export function TimelineColumn({ instance }: TimelineColumnProps) {
    const { accountId, timelineType } = instance;
    const account = useAccount(accountId);
    const [scrollPosition, setScrollPosition] = React.useState(0);

    if (!account) {
        return null;
    }

    return (
        <TimelineSubscription loadMore type={timelineType} account={account} shouldTrim={scrollPosition === 0}>
            {(items, loading, loadMore) => (
                <BaseColumn loading={loading} instance={instance} onScroll={setScrollPosition}>
                    {view => <Timeline items={items} scrollElement={view} onLoadMore={loadMore} />}
                </BaseColumn>
            )}
        </TimelineSubscription>
    );
}
