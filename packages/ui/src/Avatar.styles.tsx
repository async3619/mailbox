import styled from "@emotion/styled";

export type AvatarSize = "small" | "medium" | "large" | "tiny";
export const AvatarSizes: Record<AvatarSize, number> = {
    small: 32,
    medium: 48,
    large: 64,
    tiny: 24,
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

export const SecondaryRoot = styled.div<{ size: AvatarSize }>`
    width: ${({ size }) => AvatarSizes[size]}px;
    height: ${({ size }) => AvatarSizes[size]}px;

    position: relative;
`;
