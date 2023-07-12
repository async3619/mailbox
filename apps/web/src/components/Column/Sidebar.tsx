import React from "react";

import { Button } from "ui";
import { ButtonGroup } from "@mui/material";

import { COLUMN_SIDEBAR_WIDTH } from "@styles/constants";
import { Content, Header, Root, Wrapper } from "@components/Column/Sidebar.styles";

export interface ColumnSidebarProps {
    open: boolean;
}

export function ColumnSidebar({ open }: ColumnSidebarProps) {
    return (
        <Wrapper style={{ maxWidth: open ? `${COLUMN_SIDEBAR_WIDTH}px` : `0px` }}>
            <Root style={{ transform: open ? `translateX(0px)` : undefined }}>
                <Header>
                    <span>Column Settings</span>
                </Header>
                <Content>
                    <ButtonGroup size="small" fullWidth aria-label="small button group">
                        <Button variant="contained">Smaller</Button>
                        <Button variant="outlined">Medium</Button>
                        <Button variant="outlined">Larger</Button>
                    </ButtonGroup>
                </Content>
            </Root>
        </Wrapper>
    );
}
