import styled from "@emotion/styled";
import { LoadingButton } from "@mui/lab";

export const MinimalLoadingButton = styled(LoadingButton)`
    padding: ${({ theme }) => theme.spacing(0.125)};

    width: auto;
    min-width: auto;

    font-size: inherit;
`;
