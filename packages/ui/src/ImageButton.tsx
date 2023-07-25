import React from "react";

import { Root } from "./ImageButton.styles";

export interface ImageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    imageSrc: string;
}

export const ImageButton = React.forwardRef(
    ({ imageSrc, ...props }: ImageButtonProps, ref: React.Ref<HTMLButtonElement>) => (
        <Root ref={ref} imageSrc={imageSrc} {...props} />
    ),
);

ImageButton.displayName = "ImageButton";
