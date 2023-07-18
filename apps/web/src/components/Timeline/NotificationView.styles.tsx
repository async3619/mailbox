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

export const AccountLink = styled(UserLink)`
    color: inherit;
    font-weight: 800;
`;
