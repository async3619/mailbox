import React from "react";
import { Box, SxProps } from "@mui/material";

import { Root } from "./Avatar.styles";

export interface AvatarProps {
    src: string;
    size?: "small" | "medium" | "large";
    sx?: SxProps;
}

export function Avatar({ src, size = "medium", sx }: AvatarProps) {
    return <Box component={Root} imageSrc={src} size={size} sx={sx} />;
}
