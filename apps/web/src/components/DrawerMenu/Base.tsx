import React from "react";

import { Modal, Slide, Typography, useTheme } from "@mui/material";

import { Content, Header, Root } from "@components/DrawerMenu/Base.styles";

export interface BaseDrawerMenuProps {
    open: boolean;
    close: () => void;
    onClosed: () => void;
}

export interface Props extends BaseDrawerMenuProps {
    header: React.ReactNode | string;
}

const transitionStyles: Record<string, React.CSSProperties> = {
    entering: { transform: "translateX(-100%)" },
    entered: { transform: "translateX(0)" },
    exiting: { transform: "translateX(-100%)" },
    exited: { transform: "translateX(-100%)" },
};

export function BaseDrawerMenu({ children, close, onClosed, open, header }: React.PropsWithChildren<Props>) {
    const theme = useTheme();
    let headerContent: React.ReactNode;
    if (typeof header === "string") {
        headerContent = (
            <Typography variant="h6" fontSize="1rem" fontWeight={600}>
                {header}
            </Typography>
        );
    } else {
        headerContent = header;
    }

    return (
        <Modal
            disablePortal
            open={open}
            sx={{ position: "absolute" }}
            onClose={close}
            slotProps={{
                backdrop: {
                    timeout: theme.transitions.duration.complex,
                },
            }}
        >
            <Slide in={open} direction="right" onExited={onClosed} timeout={theme.transitions.duration.complex}>
                <Root style={{ ...transitionStyles[status] }}>
                    <Header>{headerContent}</Header>
                    <Content>{children}</Content>
                </Root>
            </Slide>
        </Modal>
    );
}
