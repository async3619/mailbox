import React from "react";

import { Drawer, Typography } from "@mui/material";

import { DRAWER_WIDTH } from "@styles/constants";
import { Title } from "@components/Navigator.styles";

export function Navigator() {
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
            <Title>
                <Typography variant="h1" fontSize="1.5rem">
                    📬
                </Typography>
            </Title>
        </Drawer>
    );
}
