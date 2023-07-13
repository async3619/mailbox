import styled from "@emotion/styled";
import { COLUMN_SIDEBAR_WIDTH } from "@styles/constants";

export const Wrapper = styled.div`
    margin: 0;
    padding: 0;
`;

export const Root = styled.div`
    width: ${COLUMN_SIDEBAR_WIDTH}px;
    height: 100%;

    border: 1px solid ${({ theme }) => theme.palette.divider};
    border-left: 0;
    border-radius: 0 4px 4px 0;

    overflow: hidden;

    background: #fff;
`;

export const Header = styled.div`
    height: ${({ theme }) => theme.spacing(7)};

    padding: ${({ theme }) => theme.spacing(0, 1.5)};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

    display: flex;
    align-items: center;

    background-color: #fff;
`;

export const Content = styled.div`
    height: 100%;
    padding: ${({ theme }) => theme.spacing(1.5)};
`;
