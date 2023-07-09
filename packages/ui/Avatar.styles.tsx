import styled from "@emotion/styled";

export type AvatarSize = "small" | "medium" | "large";
export const AvatarSizes: Record<AvatarSize, number> = {
    small: 32,
    medium: 48,
    large: 64,
};

export const Root = styled.div<{ imageSrc: string; size: AvatarSize }>`
    width: ${({ size }) => AvatarSizes[size]}px;
    height: ${({ size }) => AvatarSizes[size]}px;

    margin: 0;
    padding: 0;
    border-radius: 4px;

    background: url(${({ imageSrc }) => imageSrc}) no-repeat center center;
    background-size: cover;
`;
