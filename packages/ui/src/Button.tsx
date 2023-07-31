import * as React from "react";

import { Tooltip } from "@mui/material";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

import { MinimalLoadingButton } from "./Button.styles";

export interface ButtonProps extends LoadingButtonProps {
    minimal?: boolean;
    tooltip?: string;
    tooltipPlacement?: "top" | "bottom" | "left" | "right";
}

export const Button = ({ minimal, tooltip, tooltipPlacement, ...props }: ButtonProps) => {
    const Component = minimal ? MinimalLoadingButton : LoadingButton;
    const content = <Component disableElevation {...props} />;

    if (tooltip) {
        return (
            <Tooltip title={tooltip} placement={tooltipPlacement}>
                {content}
            </Tooltip>
        );
    }

    return content;
};
