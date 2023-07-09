import localFont from "next/font/local";
import { createTheme } from "@mui/material";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = mainColor => augmentColor({ color: { main: mainColor } });

const globalFont = localFont({
    src: "./suit.woff2",
});

export const theme = createTheme({
    palette: {
        primary: {
            main: "#1a73e8",
        },
        background: {
            default: "#eff3f5",
        },
        mastodon: createColor("#6364FF"),
    },
    typography: {
        fontFamily: [globalFont.style.fontFamily, "sans-serif"].join(","),
        fontWeightRegular: 600,
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                },
            },
        },
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
