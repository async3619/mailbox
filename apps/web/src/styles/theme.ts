import localFont from "next/font/local";

import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const globalFont = localFont({
    src: "./suit.woff2",
});

export const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                background: {
                    default: "#eff3f5",
                },
                divider: "#c0cdd9",
            },
        },
        dark: {
            palette: {},
        },
    },
    typography: {
        fontFamily: [globalFont.style.fontFamily, "sans-serif"].join(","),
        fontWeightRegular: 600,
    },
    components: {
        MuiTooltip: {
            defaultProps: {
                arrow: true,
            },
            styleOverrides: {
                tooltip: {
                    fontSize: "0.8rem",
                },
            },
        },
    },
});
