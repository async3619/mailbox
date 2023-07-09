import styled from "@emotion/styled";

export const Root = styled.div<{ hidden: boolean }>`
    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    font-size: ${({ theme }) => theme.spacing(8)};

    background: #bfe3ff;
    opacity: ${({ hidden }) => (hidden ? 0 : 1)};

    transition: ${({ theme }) =>
        theme.transitions.create("opacity", {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.enteringScreen,
        })};

    z-index: ${({ theme }) => theme.zIndex.drawer + 1};
    pointer-events: ${({ hidden }) => (hidden ? "none" : "auto")};
`;
