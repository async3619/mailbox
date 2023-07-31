import styled from "@emotion/styled";

export const Root = styled.div`
    margin: ${({ theme }) => theme.spacing(1.5)} 0 0;
    padding: 0;

    font-size: 1.125rem;

    display: flex;
    justify-content: space-between;

    color: ${({ theme }) => theme.palette.text.disabled};
`;
