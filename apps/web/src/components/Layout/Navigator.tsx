import React from "react";
import { Scrollbars } from "rc-scrollbars";
import { useRecoilState } from "recoil";
import shortid from "shortid";
import { IconButton } from "ui";

import { Box, Divider, Drawer, Stack } from "@mui/material";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";

import { LogoSvg } from "@components/LogoSvg";
import { useDialog } from "@components/Dialog";
import { AddAccountDialog } from "@components/Dialog/AddAccount";

import { columnState } from "@states/columns";
import { useAccounts } from "@states/accounts";

import { DRAWER_WIDTH } from "@styles/constants";

import { Title } from "@components/Layout/Navigator.styles";
import { AccountButton } from "@components/AccountButton";

export function Navigator() {
    const [columns, setColumns] = useRecoilState(columnState);
    const { showDialog } = useDialog();
    const { accounts } = useAccounts();

    const handleAccountAdd = () => {
        showDialog(AddAccountDialog);
    };
    const handleAddClick = () => {
        setColumns(columns => [...columns, { id: shortid() }]);
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
                    <Divider sx={{ mb: 2, mt: 1 }} />
                    <Box display="flex" justifyContent="center">
                        <Stack spacing={2}>
                            {columns.map(column => (
                                <IconButton
                                    key={column.id}
                                    color="primary"
                                    tooltip={`Column ${column.id}`}
                                    tooltipPlacement="right"
                                >
                                    <ViewColumnRoundedIcon />
                                </IconButton>
                            ))}
                            <IconButton
                                color="primary"
                                onClick={handleAddClick}
                                tooltip="Add Column"
                                tooltipPlacement="right"
                            >
                                <AddRoundedIcon />
                            </IconButton>
                        </Stack>
                    </Box>
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
