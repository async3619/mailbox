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
    const { accountId, data } = instance;
    const account = useAccount(accountId);
    const timeline = React.useMemo(() => account?.getTimeline(instance.data), [account, instance]);
    const [scrollPosition, setScrollPosition] = React.useState(0);

    if (!account) {
        return null;
    }

    if (data.type !== account.getServiceType()) {
        throw new Error(
            `Column data is not matched with account service type: ${data.type} !== ${account.getServiceType()}`,
        );
    }

    return (
        <TimelineSubscription timeline={timeline} shouldTrim={scrollPosition === 0}>
            {(items, loading) => (
                <BaseColumn loading={loading} instance={instance} onScroll={setScrollPosition}>
                    {view => <Timeline items={items} scrollElement={view} />}
                </BaseColumn>
            )}
        </TimelineSubscription>
    );
}
