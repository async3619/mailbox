import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
`;

export const Header = styled.div`
    padding: ${({ theme }) => theme.spacing(2, 2, 0)};
    display: block;
`;
