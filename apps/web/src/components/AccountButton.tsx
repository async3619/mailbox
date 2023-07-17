import React from "react";
import { ImageButton } from "ui";

import { Tooltip } from "@mui/material";

import { useDrawerMenu } from "@components/DrawerMenu";
import { MastodonAddColumnDrawerMenu } from "@components/DrawerMenu/MastodonAddColumn";

import { BaseAccount } from "@services/base/account";

export interface AccountButtonProps {
    account: BaseAccount<string>;
}

export function AccountButton({ account }: AccountButtonProps) {
    const drawerMenu = useDrawerMenu();

    const handleClick = React.useCallback(() => {
        drawerMenu.showDrawerMenu(MastodonAddColumnDrawerMenu, { account });
    }, [drawerMenu, account]);

    return (
        <Tooltip title={account.getUserId()} placement="right">
            <ImageButton imageSrc={account.getAvatarUrl()} onClick={handleClick} />
        </Tooltip>
    );
}
