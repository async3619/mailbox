import { ButtonBase } from "@mui/material";

import styled from "@emotion/styled";

export const Root = styled(ButtonBase, {
    shouldForwardProp: prop => prop !== "imageSrc",
})<{ imageSrc: string }>`
    width: ${({ theme }) => theme.spacing(6)};
    height: ${({ theme }) => theme.spacing(6)};

    margin: 0;
    padding: 0;
    border-radius: ${({ theme }) => theme.spacing(0.5)};

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${({ imageSrc }) => imageSrc});
`;
