import { SelectServiceStep } from "@components/Dialog/AddAccount/SelectServiceStep";
import { MastodonLoginStep } from "@components/Dialog/AddAccount/MastodonLoginStep";

import { createBranchedStep, createNormalStep } from "@components/Stepper/utils";

export type AddAccountServices = "mastodon";

export const ADD_ACCOUNT_STEP = createBranchedStep<AddAccountServices>({
    component: SelectServiceStep,
    branches: {
        mastodon: createNormalStep({
            component: MastodonLoginStep,
        }),
    },
});
