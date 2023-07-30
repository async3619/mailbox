import "@emotion/react";

import type { CssVarsTheme as MuiTheme, PaletteColorOptions } from "@mui/material";

declare module "@emotion/react" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Theme extends MuiTheme {}
}

declare module "@mui/material/styles" {
    interface CustomPalette {
        mastodon: PaletteColorOptions;
    }
    interface Palette extends CustomPalette {}
    interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/lab" {
    interface ButtonPropsColorOverrides {
        mastodon: true;
    }
}

declare module "@mui/material" {
    interface ButtonPropsColorOverrides {
        mastodon: true;
    }
}
