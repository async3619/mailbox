import React from "react";
import { useTranslation } from "next-i18next";
import { Button } from "ui";

import { withStep } from "@components/Stepper/withStep";
import { BranchedStep } from "@components/Stepper/types";
import { AddAccountServices } from "@components/Dialog/AddAccount/constants";

import { MastodonLogo } from "@components/Svg/Mastodon";

export interface SelectServiceStep extends BranchedStep<AddAccountServices> {}

export const SelectServiceStep = withStep<SelectServiceStep>()(({ moveNext }) => {
    const { t } = useTranslation();

    return (
        <div>
            <Button
                fullWidth
                variant="contained"
                color="mastodon"
                startIcon={<MastodonLogo />}
                onClick={() => moveNext("mastodon")}
            >
                {t("actions.addAccount.mastodon.title")}
            </Button>
        </div>
    );
});
