/* eslint-disable @typescript-eslint/no-empty-function */
import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";
import { render, screen } from "@testing-library/react";
import { MediaViewerItem } from "@components/Media/ViewerItem";

describe("<MediaViewerItem />", () => {
    let pauseStub: jest.SpyInstance;
    let playStub: jest.SpyInstance;

    beforeEach(() => {
        pauseStub = jest.spyOn(window.HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
        playStub = jest.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(async () => {});
    });

    afterEach(() => {
        pauseStub.mockRestore();
        playStub.mockRestore();
    });

    it("should render MediaViewerItem properly", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaViewerItem
                    attachment={{ type: "image", url: "__TEST__", previewUrl: "__TEST__" }}
                    active={false}
                    expanded={false}
                />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer-item");
        expect(root).toBeInTheDocument();
    });

    it("should render <img /> if attachment type is image", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaViewerItem
                    attachment={{ type: "image", url: "__TEST__", previewUrl: "__TEST__" }}
                    active={false}
                    expanded={false}
                />
            </ThemeProvider>,
        );

        const img = screen.getByRole("img");
        expect(img).toBeInTheDocument();
    });

    it("should render <video /> if attachment type is video", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaViewerItem
                    attachment={{ type: "video", url: "__TEST__", previewUrl: "__TEST__" }}
                    active={false}
                    expanded={false}
                />
            </ThemeProvider>,
        );

        const video = screen.getByRole("application");
        expect(video).toBeInTheDocument();
        expect(pauseStub).toBeCalledTimes(1);
    });

    it("should render <video /> if attachment type is gifv", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaViewerItem
                    attachment={{ type: "gifv", url: "__TEST__", previewUrl: "__TEST__" }}
                    active={false}
                    expanded={false}
                />
            </ThemeProvider>,
        );

        const video = screen.getByRole("application");
        expect(video).toBeInTheDocument();
        expect(pauseStub).toBeCalledTimes(1);
    });

    it("should play video if component is active", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaViewerItem
                    attachment={{ type: "video", url: "__TEST__", previewUrl: "__TEST__" }}
                    active={true}
                    expanded={false}
                />
            </ThemeProvider>,
        );

        const video = screen.getByRole("application");
        expect(video).toBeInTheDocument();
        expect(playStub).toBeCalledTimes(1);
    });

    it("should have correct styles if attachment is not expanded", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaViewerItem
                    attachment={{ type: "image", url: "__TEST__", previewUrl: "__TEST__", width: 100, height: 100 }}
                    active={false}
                    expanded={false}
                />
            </ThemeProvider>,
        );

        const img = screen.getByTestId("media-viewer-item-img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveStyle({
            height: "100px",
        });
    });

    it("should have correct styles if attachment is expanded", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaViewerItem
                    attachment={{ type: "image", url: "__TEST__", previewUrl: "__TEST__", width: 150, height: 100 }}
                    active={false}
                    expanded={true}
                />
            </ThemeProvider>,
        );

        const img = screen.getByTestId("media-viewer-item-img");
        expect(img).toBeInTheDocument();
        expect(img).toHaveStyle({
            width: "100%",
        });
    });
});
