import React from "react";

import { BaseAccount } from "@services/base/account";

import { ImageButton } from "ui/ImageButton";
import { Tooltip } from "@mui/material";

export interface AccountButtonProps {
    account: BaseAccount<string>;
}

export function AccountButton({ account }: AccountButtonProps) {
    return (
        <Tooltip title={account.getUserId()} placement="right">
            <ImageButton imageSrc={account.getAvatarUrl()} />
        </Tooltip>
    );
}
