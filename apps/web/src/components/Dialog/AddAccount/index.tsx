import React from "react";
import { useTranslation } from "next-i18next";

import { BaseDialog, BaseDialogProps } from "ui";

import { Typography } from "@mui/material";

import { Stepper } from "@components/Stepper/Stepper";

import { ADD_ACCOUNT_STEP } from "@components/Dialog/AddAccount/constants";
import { Header, Root } from "@components/Dialog/AddAccount/index.styles";

export interface AddAccountDialogProps extends BaseDialogProps {}

export function AddAccountDialog({ ...props }: AddAccountDialogProps) {
    const { t } = useTranslation();

    return (
        <BaseDialog maxWidth="xs" fullWidth {...props}>
            <Root>
                <Header>
                    <Typography variant="h6" fontWeight={800} textAlign="center">
                        {t("actions.addAccount.title")}
                    </Typography>
                </Header>
                <Stepper step={ADD_ACCOUNT_STEP} />
            </Root>
        </BaseDialog>
    );
}
