import styled from "@emotion/styled";

export const Root = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    .media {
        max-width: 100%;
        max-height: 100%;

        display: block;
        object-fit: contain;

        transition: ${({ theme }) => theme.transitions.create("width")};
    }
`;
