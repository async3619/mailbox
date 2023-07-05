import * as React from "react";

import { Root } from "./IconButton.styles";
import { Tooltip } from "@mui/material";

interface Props extends React.ComponentProps<typeof Root> {
    children?: React.ReactNode;
    tooltip?: string;
    tooltipPlacement?: "top" | "bottom" | "left" | "right";
}

export const IconButton = ({ tooltip, tooltipPlacement, ...props }: Props) => {
    const content = <Root {...props} />;
    if (tooltip) {
        return (
            <Tooltip title={tooltip} placement={tooltipPlacement}>
                {content}
            </Tooltip>
        );
    }

    return content;
};
