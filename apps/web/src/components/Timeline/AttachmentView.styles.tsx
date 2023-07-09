import { ButtonBase } from "@mui/material";

import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const Item = styled(ButtonBase)`
    width: 100%;

    margin: 0;
    padding: 0;
    border-radius: 4px;

    display: block;

    aspect-ratio: 16 / 9;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;
