import styled from "@emotion/styled";
import { ButtonBase } from "@mui/material";

export const Root = styled(ButtonBase, {
    shouldForwardProp: prop => prop !== "blur",
})<{ blur: boolean }>`
    width: 100%;

    margin: 0;
    padding: 0;
    border-radius: 4px;

    display: block;
    position: relative;
    overflow: hidden;

    aspect-ratio: 16 / 9;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    > video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        object-fit: cover;
    }

    &:before {
        content: "";

        width: 100%;
        height: 100%;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;

        visibility: ${({ blur }) => (blur ? "visible" : "hidden")};

        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(48px);
    }
`;

export const Label = styled.div`
    margin: ${({ theme }) => theme.spacing(1)} !important;
    padding: ${({ theme }) => theme.spacing(0.5, 1)};
    border-radius: 4px;

    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 10;

    color: white;
    background-color: rgba(0, 0, 0, 0.75);
`;

export const Play = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;

    font-size: ${({ theme }) => theme.spacing(6)};

    color: white;
    background-color: rgba(0, 0, 0, 0.35);

    > svg {
        display: block;
    }
`;
