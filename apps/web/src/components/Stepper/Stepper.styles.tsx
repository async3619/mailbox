import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;

    position: relative;
    overflow: hidden;

    transition: ${({ theme }) => theme.transitions.create(["height"])};
`;

export const StepContainer = styled.div``;

export const StepWrapper = styled.div``;
