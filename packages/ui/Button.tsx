import * as React from "react";

import { ButtonProps as MuiButtonProps } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export interface ButtonProps extends MuiButtonProps {
    loading?: boolean;
}

export const Button = (props: ButtonProps) => {
    return <LoadingButton {...props} />;
};

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        mastodon: true;
    }
}
