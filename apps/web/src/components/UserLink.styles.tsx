import styled from "@emotion/styled";

export const Root = styled.a`
    color: ${({ theme }) => theme.palette.primary.main};

    text-decoration: none;

    &:hover,
    &:focus-visible {
        text-decoration: underline;
    }
`;
