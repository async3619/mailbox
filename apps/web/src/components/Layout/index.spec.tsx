import { RecoilRoot } from "recoil";

import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";

import { theme } from "@styles/theme";

import { Splash } from "@components/Splash";
import { EmojiContext } from "@components/Emoji/context";
import { DialogProvider } from "@components/Dialog/Provider";

import { Layout } from ".";

describe("<Layout />", () => {
    it("should render Layout properly", () => {
        render(
            <RecoilRoot>
                <EmojiContext.Provider value={{ loading: false, parse: jest.fn() }}>
                    <DialogProvider>
                        <ThemeProvider theme={theme}>
                            <Splash>
                                <Layout>
                                    <div>test</div>
                                </Layout>
                            </Splash>
                        </ThemeProvider>
                    </DialogProvider>
                </EmojiContext.Provider>
            </RecoilRoot>,
        );

        const main = screen.getByTestId("layout-main");
        expect(main).toBeInTheDocument();
    });
});
