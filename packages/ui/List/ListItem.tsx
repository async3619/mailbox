import React from "react";

import styled from "@emotion/styled";

import { alpha, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from "@mui/material";

export const Text = styled(ListItemText)`
    margin: 0;

    .MuiTypography-root {
        font-size: 0.95rem;
        color: ${({ theme }) => theme.palette.text.primary};
    }
`;

export const Root = styled(ListItemButton)`
    padding: ${({ theme }) => theme.spacing(1)};
    border-radius: 4px;

    color: ${({ theme }) => theme.palette.primary.main};

    &:hover,
    &:focus-visible {
        background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.palette.primary.main};
    }
`;

export const Icon = styled(ListItemIcon)`
    margin-right: ${({ theme }) => theme.spacing(1)};

    min-width: auto;
`;

export const EndIcon = styled.div`
    display: flex;
    align-items: center;

    color: ${({ theme }) => theme.palette.text.secondary};

    svg {
        display: block;
    }
`;

export interface ListItemProps extends ListItemButtonProps {
    children: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

export function ListItem({ children, startIcon, endIcon, ...rest }: ListItemProps) {
    return (
        <Root {...rest}>
            {startIcon && <Icon>{startIcon}</Icon>}
            <Text primary={children} />
            {endIcon && <EndIcon>{endIcon}</EndIcon>}
        </Root>
    );
}
