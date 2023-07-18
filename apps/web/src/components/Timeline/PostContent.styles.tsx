import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;
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
