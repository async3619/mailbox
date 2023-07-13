import React from "react";
import { Box, SxProps } from "@mui/material";

import { AvatarSize, Root, SecondaryRoot } from "./Avatar.styles";

export interface AvatarProps {
    src: string;
    secondarySrc?: string;
    size?: AvatarSize;
    sx?: SxProps;
}

export function Avatar({ src, secondarySrc, size = "medium", sx }: AvatarProps) {
    if (secondarySrc) {
        return (
            <Box component={SecondaryRoot} size={size} sx={sx}>
                <Avatar src={src} sx={{ position: "absolute", top: 0, left: 0, width: "80%", height: "80%" }} />
                <Avatar
                    size="tiny"
                    src={secondarySrc}
                    sx={{ position: "absolute", bottom: 0, right: 0, outline: "2px solid white" }}
                />
            </Box>
        );
    }

    return <Box component={Root} imageSrc={src} size={size} sx={sx} />;
}
