import styled from "@emotion/styled";
import { COLUMN_SIZE_MAP } from "@styles/constants";

import { ColumnSize } from "@components/Column/types";

export const Wrapper = styled.div`
    height: 100%;

    display: flex;
`;

export const Root = styled.div<{ size: ColumnSize }>`
    width: ${({ size }) => COLUMN_SIZE_MAP[size]}px;
    height: 100%;

    display: flex;
    flex-direction: column;

    margin: 0;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-radius: ${({ theme }) => theme.spacing(0.5)};

    background: white;

    transition: ${({ theme }) => theme.transitions.create("border-radius")};
`;

export const Header = styled.div`
    height: ${({ theme }) => theme.spacing(7)};

    padding: ${({ theme }) => theme.spacing(0, 1.5)};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

    display: flex;
    align-items: center;
    flex: 0 0 ${({ theme }) => theme.spacing(7)};

    .controls {
        opacity: 0;

        transition: ${({ theme }) =>
            theme.transitions.create("opacity", {
                duration: theme.transitions.duration.shortest,
            })};
    }

    &:hover {
        .controls {
            opacity: 1;
        }
    }
`;

export const Title = styled.div`
    height: 100%;

    display: flex;
    align-items: center;

    flex: 1 1 auto;

    cursor: pointer;
    user-select: none;
`;

export const Handle = styled.button`
    margin-right: ${({ theme }) => theme.spacing(0.5)};
    padding: ${({ theme }) => theme.spacing(0.75, 0.5)};
    border: 0;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: white;
    cursor: pointer;

    outline: none;

    &:before,
    &:after {
        content: "";

        width: 2px;
        height: ${({ theme }) => theme.spacing(2)};

        background: ${({ theme }) => theme.palette.text.disabled};

        opacity: 0.5;
    }

    &:before {
        margin-right: ${({ theme }) => theme.spacing(0.25)};
    }

    &:hover,
    &:focus-visible {
        background: ${({ theme }) => theme.palette.action.hover};
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.palette.action.focus};
    }

    &:active {
        background: ${({ theme }) => theme.palette.action.selected};
    }
`;

export const Content = styled.div`
    height: 100%;

    position: relative;
`;

export const ProgressWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    transition: ${({ theme }) => theme.transitions.create("opacity")};
`;
