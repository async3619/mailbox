import React from "react";
import { Button } from "ui";

import { withStep } from "@components/Stepper/withStep";
import { BranchedStep } from "@components/Stepper/types";
import { AddAccountServices } from "@components/Dialog/AddAccount/constants";

import { MastodonLogo } from "@components/Svg/Mastodon";

export interface SelectServiceStep extends BranchedStep<AddAccountServices> {}

export const SelectServiceStep = withStep<SelectServiceStep>()(({ moveNext }) => {
    return (
        <div>
            <Button
                fullWidth
                variant="contained"
                color="mastodon"
                startIcon={<MastodonLogo />}
                onClick={() => moveNext("mastodon")}
            >
                Add Mastodon Account
            </Button>
        </div>
    );
});
