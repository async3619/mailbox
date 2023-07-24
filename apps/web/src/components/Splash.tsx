import React from "react";

import { LogoSvg } from "@components/LogoSvg";

import { Root } from "@components/Splash.styles";
import { CircularProgress } from "@mui/material";

export interface SplashContextValue {
    hide(): void;
    hidden: boolean;
}

export const SplashContext = React.createContext<SplashContextValue | null>(null);

export function Splash({ children }: React.PropsWithChildren) {
    const [visibility, setVisibility] = React.useState(true);
    const hide = React.useCallback(() => setVisibility(false), []);

    return (
        <SplashContext.Provider value={{ hide, hidden: !visibility }}>
            <Root hidden={!visibility}>
                <LogoSvg fontSize="inherit" />
                <CircularProgress size={24} sx={{ mt: 2 }} />
            </Root>
            {children}
        </SplashContext.Provider>
    );
}

export function useSplash() {
    const context = React.useContext(SplashContext);
    if (!context) {
        throw new Error("useSplash must be used within a <Splash />");
    }

    return context;
}
