import styled from "@emotion/styled";

export const Root = styled.div`
    font-size: 0.85rem;
`;

export const Paragraph = styled.p`
    margin-bottom: 0.75em !important;

    &:last-child {
        margin-bottom: 0 !important;
    }
`;

export const Span = styled.span``;

export const Link = styled.a<{ ellipsis?: boolean }>`
    text-decoration: none;

    color: ${({ theme }) => theme.palette.primary.main};

    &:hover,
    &:focus-visible {
        text-decoration: underline;
    }

    &:after {
        content: "${({ ellipsis }) => (ellipsis ? "..." : "")}";
    }
`;
