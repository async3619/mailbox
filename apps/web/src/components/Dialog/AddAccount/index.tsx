import React from "react";

import { BaseDialog, BaseDialogProps } from "ui/dialogs";

import { Typography } from "@mui/material";

import { Stepper } from "@components/Stepper/Stepper";

import { ADD_ACCOUNT_STEP } from "@components/Dialog/AddAccount/constants";
import { Header, Root } from "@components/Dialog/AddAccount/index.styles";

export interface AddAccountDialogProps extends BaseDialogProps {}

export function AddAccountDialog({ ...props }: AddAccountDialogProps) {
    return (
        <BaseDialog maxWidth="xs" fullWidth {...props}>
            <Root>
                <Header>
                    <Typography variant="h6" fontWeight={800} textAlign="center">
                        Add New Account
                    </Typography>
                </Header>
                <Stepper step={ADD_ACCOUNT_STEP} />
            </Root>
        </BaseDialog>
    );
}
