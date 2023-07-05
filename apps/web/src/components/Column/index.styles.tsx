import styled from "@emotion/styled";

export const Root = styled.div`
    width: ${({ theme }) => theme.spacing(35)};

    margin: 0;
    border: 1px solid ${({ theme }) => theme.vars.palette.divider};
    border-radius: ${({ theme }) => theme.spacing(0.5)};

    background: white;
`;

export const Header = styled.div`
    padding: ${({ theme }) => theme.spacing(1.5)};
    border-bottom: 1px solid ${({ theme }) => theme.vars.palette.divider};

    display: flex;
    align-items: center;
`;

export const Handle = styled.button`
    margin-right: ${({ theme }) => theme.spacing(0.5)};
    padding: ${({ theme }) => theme.spacing(0.75, 0.5)};
    border: 0;
    border-radius: 2px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: white;
    cursor: pointer;

    outline: none;

    &:before,
    &:after {
        content: "";

        width: 2px;
        height: ${({ theme }) => theme.spacing(2)};

        background: ${({ theme }) => theme.vars.palette.text.disabled};

        opacity: 0.5;
    }

    &:before {
        margin-right: ${({ theme }) => theme.spacing(0.25)};
    }

    &:hover,
    &:focus-visible {
        background: ${({ theme }) => theme.vars.palette.action.hover};
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${({ theme }) => theme.vars.palette.action.focus};
    }

    &:active {
        background: ${({ theme }) => theme.vars.palette.action.selected};
    }
`;
