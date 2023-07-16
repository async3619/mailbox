import styled from "@emotion/styled";
import { UserLink } from "@components/UserLink";

export const Root = styled.div`
    width: 100%;

    padding: ${({ theme }) => theme.spacing(1.5)};
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const ProfileList = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing(1)};

    display: flex;
`;

export const Content = styled.div`
    margin-top: ${({ theme }) => theme.spacing(1)} !important;

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

export const AccountLink = styled(UserLink)`
    color: inherit;
    font-weight: 800;
`;
