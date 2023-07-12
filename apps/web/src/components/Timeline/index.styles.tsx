import styled from "@emotion/styled";

export const Root = styled.div`
    width: 100%;
    max-width: 100%;

    margin: 0;
    padding: 0;

    position: relative;

    overflow-x: hidden;
    overflow-y: hidden;
`;

export const Content = styled.div`
    width: 100%;

    position: absolute;
    top: 0;
    left: 0;
`;

export const CacheRenderer = styled.div`
    position: fixed;
    top: 0;
    right: 0;

    z-index: 500000;

    pointer-events: none;
    visibility: hidden;
`;
