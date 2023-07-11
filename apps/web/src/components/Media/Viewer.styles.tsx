import { Swiper } from "swiper/react";

import styled from "@emotion/styled";

import { ButtonBase } from "@mui/material";

export const Root = styled.div`
    max-height: 100vh;

    margin: 0;
    padding: 0;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .media {
        max-width: 100%;
        max-height: 100%;

        display: block;
        object-fit: contain;
    }
`;

export const Content = styled.div`
    width: 100%;

    position: relative;

    flex: 1 1 auto;
`;

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

export const SwiperRoot = styled(Swiper)`
    height: 100%;
`;

export const Controls = styled.div`
    width: 100%;

    padding: ${({ theme }) => theme.spacing(2)};

    display: flex;
    flex: 0 0 auto;
    justify-content: center;

    color: white;
`;

export const Navigator = styled(ButtonBase)`
    height: 100%;

    padding: ${({ theme }) => theme.spacing(1)};

    color: white;

    &:disabled {
        opacity: 0;
    }
`;
