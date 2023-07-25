import React from "react";

import { List as MuiList, ListProps as MuiListProps } from "@mui/material";

export interface ListProps extends MuiListProps {}

export function List({ children, ...rest }: ListProps) {
    return (
        <MuiList sx={{ py: 0 }} {...rest}>
            {children}
        </MuiList>
    );
}
