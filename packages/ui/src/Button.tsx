import * as React from "react";

import { LoadingButton, LoadingButtonProps } from "@mui/lab";

export interface ButtonProps extends LoadingButtonProps {}

export const Button = (props: ButtonProps) => {
    return <LoadingButton disableElevation {...props} />;
};
