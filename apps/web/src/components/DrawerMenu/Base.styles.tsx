import styled from "@emotion/styled";

export const Root = styled.div`
    width: ${({ theme }) => theme.spacing(40)};

    margin: 0;
    padding: 0;
    border-top-right-radius: ${({ theme }) => theme.spacing(1)};
    border-bottom-right-radius: ${({ theme }) => theme.spacing(1)};

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: ${({ theme }) => theme.zIndex.drawer - 1};

    background-color: ${({ theme }) => theme.palette.background.paper};
    box-shadow: ${({ theme }) => theme.shadows[12]};

    outline: none;
`;

export const Header = styled.div`
    min-height: ${({ theme }) => theme.spacing(7)};

    padding: ${({ theme }) => theme.spacing(1)};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

    display: flex;
    align-items: center;
`;

export const Content = styled.div`
    padding: ${({ theme }) => theme.spacing(1)};
`;
