import { RecoilRoot } from "recoil";
import { render, screen } from "@testing-library/react";

import { ThemeProvider } from "@mui/material";

import { AttachmentView } from "@components/Timeline/AttachmentView";
import { BaseColumn } from "@components/Column/Base";

import { theme } from "@styles/theme";

import {
    MOCK_ATTACHMENT,
    MOCK_COLUMN,
    MOCK_GIF_ATTACHMENT,
    MOCK_TIMELINE_POST,
    MOCK_VIDEO_ATTACHMENT,
} from "../../../__tests__/fixture";
import { SensitiveBlurring } from "@components/Column/types";

describe("<AttachmentView />", () => {
    it("should render AttachmentView properly", async () => {
        render(
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <BaseColumn instance={MOCK_COLUMN}>
                        <AttachmentView post={MOCK_TIMELINE_POST} attachment={MOCK_ATTACHMENT} />
                    </BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const root = screen.getByTestId("attachment-view");
        expect(root).toBeInTheDocument();
    });

    it("should show GIF caption on gifv attachment type", () => {
        render(
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <BaseColumn instance={MOCK_COLUMN}>
                        <AttachmentView post={MOCK_TIMELINE_POST} attachment={MOCK_GIF_ATTACHMENT} />
                    </BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const label = screen.getByText("GIF");
        expect(label).toBeInTheDocument();
    });

    it("should render play icon on video attachment type", () => {
        render(
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <BaseColumn instance={MOCK_COLUMN}>
                        <AttachmentView post={MOCK_TIMELINE_POST} attachment={MOCK_VIDEO_ATTACHMENT} />
                    </BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const playIcon = screen.getByTestId("play-icon");
        expect(playIcon).toBeInTheDocument();
    });

    it("should blur attachment view if post is sensitive", () => {
        render(
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <BaseColumn instance={MOCK_COLUMN}>
                        <AttachmentView
                            post={{ ...MOCK_TIMELINE_POST, sensitive: true }}
                            attachment={MOCK_ATTACHMENT}
                        />
                    </BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const overlay = screen.getByTestId("blur-overlay");
        expect(overlay).toBeInTheDocument();
    });

    it("should not blur attachment view if sensitiveBlurring is disabled", () => {
        render(
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <BaseColumn instance={{ ...MOCK_COLUMN, sensitiveBlurring: SensitiveBlurring.WithoutBlur }}>
                        <AttachmentView
                            post={{
                                ...MOCK_TIMELINE_POST,
                                sensitive: true,
                            }}
                            attachment={MOCK_ATTACHMENT}
                        />
                    </BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const overlay = screen.queryByTestId("blur-overlay");
        expect(overlay).not.toBeInTheDocument();
    });
});
