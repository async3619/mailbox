import styled from "@emotion/styled";

export const Root = styled.div<{ withoutPadding?: boolean }>`
    margin: 0;
    padding: ${({ theme, withoutPadding = false }) => theme.spacing(withoutPadding ? 0 : 1.5)};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const Header = styled.div`
    min-width: 0;

    margin-bottom: ${({ theme }) => theme.spacing(1.5)};

    display: flex;
    align-items: center;
`;

export const SpoilerButton = styled.button`
    min-width: ${({ theme }) => theme.spacing(5.75)};

    margin-left: ${({ theme }) => theme.spacing(1)};
    padding: ${({ theme }) => theme.spacing(0.5, 0.5)};
    border: 0;
    border-radius: 4px;

    display: inline-block;

    color: ${({ theme }) => theme.palette.text.primary};
    background: ${({ theme }) => theme.palette.divider};

    cursor: pointer;
`;
