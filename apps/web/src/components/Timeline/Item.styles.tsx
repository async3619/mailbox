import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: ${({ theme }) => theme.spacing(1.5)};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const Header = styled.div`
    min-width: 0;

    margin-bottom: ${({ theme }) => theme.spacing(1.5)};

    display: flex;
    align-items: center;
`;

export const Content = styled.div`
    font-size: 0.85rem;

    p {
        margin: 0;
        padding: 0;

        font-size: inherit;
        white-space: pre-wrap;
        unicode-bidi: plaintext;
        overflow-wrap: break-word;

        & + p {
            margin-top: ${({ theme }) => theme.spacing(2)};
        }
    }

    a {
        color: ${({ theme }) => theme.palette.primary.main};
        text-decoration: none;
        white-space: pre-wrap;

        &:hover,
        &:focus-visible {
            text-decoration: underline;
        }
    }
`;
