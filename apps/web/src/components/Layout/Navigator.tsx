import React from "react";
import { Scrollbars } from "rc-scrollbars";
import { IconButton } from "ui";

import { Box, Divider, Drawer, Stack } from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";

import { LogoSvg } from "@components/LogoSvg";
import { useDialog } from "@components/Dialog";
import { AddAccountDialog } from "@components/Dialog/AddAccount";

import { useAccounts } from "@states/accounts";

import { DRAWER_WIDTH } from "@styles/constants";

import { Title } from "@components/Layout/Navigator.styles";
import { AccountButton } from "@components/AccountButton";

export function Navigator() {
    const { showDialog } = useDialog();
    const { accounts } = useAccounts();

    const handleAccountAdd = () => {
        showDialog(AddAccountDialog);
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: DRAWER_WIDTH,
                    boxSizing: "border-box",
                },
            }}
        >
            <Scrollbars autoHide>
                <Box p={1}>
                    <Title>
                        <IconButton size="large" color="primary">
                            <LogoSvg fontSize="large" />
                        </IconButton>
                    </Title>
                    <Divider sx={{ mb: 2, mt: 2 }} />
                    <Box display="flex" justifyContent="center">
                        <Stack spacing={2}>
                            {accounts.map(account => (
                                <AccountButton key={account.getUniqueId()} account={account} />
                            ))}
                            <IconButton
                                color="primary"
                                tooltip="Add Account"
                                tooltipPlacement="right"
                                onClick={handleAccountAdd}
                                size="large"
                            >
                                <PersonAddAltRoundedIcon />
                            </IconButton>
                        </Stack>
                    </Box>
                </Box>
            </Scrollbars>
        </Drawer>
    );
}
