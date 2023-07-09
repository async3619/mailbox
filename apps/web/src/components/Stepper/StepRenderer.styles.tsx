import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    opacity: 0;
    transform: translateX(-100%);

    transition: ${({ theme }) => theme.transitions.create(["opacity", "transform"])};
`;
