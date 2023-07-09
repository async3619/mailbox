import React from "react";

import { Timeline } from "@components/Timeline";
import { TimelineColumnInstance } from "@components/Column/types";
import { BaseColumn } from "@components/Column/Base";

import { useAccount } from "@states/accounts";
import { useSubscribeTimeline } from "@services/base/timeline";

export interface TimelineColumnProps {
    instance: TimelineColumnInstance;
}

export function TimelineColumn({ instance }: TimelineColumnProps) {
    const { accountId, data } = instance;
    const account = useAccount(accountId);
    const timeline = React.useMemo(() => account?.getTimeline(), [account]);
    const [loading, items] = useSubscribeTimeline(timeline);

    if (!account) {
        return null;
    }

    if (data.type !== account.getServiceType()) {
        throw new Error(
            `Column data is not matched with account service type: ${data.type} !== ${account.getServiceType()}`,
        );
    }

    return (
        <BaseColumn loading={loading} instance={instance}>
            <Timeline items={items} />
        </BaseColumn>
    );
}
