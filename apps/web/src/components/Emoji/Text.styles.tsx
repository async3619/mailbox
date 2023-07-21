import styled from "@emotion/styled";
import { EmojiTextSize } from "@components/Emoji/Text";

export const Root = styled.span<{ size: EmojiTextSize }>`
    margin: 0;
    padding: 0;

    img {
        height: ${({ size }) => (size === "medium" ? "2em" : "1.25em")};
        margin: ${({ size }) => (size === "small" ? "-.2ex .15em .2ex" : "0")};

        font-size: inherit;
        vertical-align: middle;
        object-fit: contain;

        transition: ${({ theme }) =>
            theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
            })};

        &:hover {
            transform: ${({ size }) => (size === "medium" ? "scale(1.25)" : "scale(1)")};
        }
    }
`;
