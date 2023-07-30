import React from "react";
import { useTranslation } from "next-i18next";

import { Typography } from "@mui/material";

import { ColumnInstance } from "@components/Column/types";
import { Content, Header, Root, Wrapper } from "@components/Column/Sidebar/Base.styles";

export interface ColumnSidebarProps {
    instance: ColumnInstance;
}

export function BaseColumnSidebar({ children }: React.PropsWithChildren<ColumnSidebarProps>) {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Root>
                <Header>
                    <Typography variant="h6" fontSize="0.9rem" fontWeight={800}>
                        {t("columns.settings.title")}
                    </Typography>
                </Header>
                <Content>{children}</Content>
            </Root>
        </Wrapper>
    );
}
