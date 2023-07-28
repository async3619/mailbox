import { ThemeProvider } from "@mui/material";

import { act, render, screen } from "@testing-library/react";

import { useMedia } from "@components/Media";
import { MediaProvider } from "@components/Media/Provider";

import { theme } from "@styles/theme";

describe("<MediaProvider />", () => {
    it("should render MediaProvider properly", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaProvider>
                    <div data-testid="root" />
                </MediaProvider>
            </ThemeProvider>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();
    });

    it("should be able to open media viewer", () => {
        function MockComponent() {
            const { openMediaViewer } = useMedia();

            return (
                <div data-testid="root">
                    <button onClick={() => openMediaViewer([], 0)}>Open</button>
                </div>
            );
        }

        render(
            <ThemeProvider theme={theme}>
                <MediaProvider>
                    <MockComponent />
                </MediaProvider>
            </ThemeProvider>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();

        const button = screen.getByText("Open");
        expect(button).toBeInTheDocument();

        act(() => {
            button.click();
        });

        const mediaViewer = screen.getByTestId("media-viewer");
        expect(mediaViewer).toBeInTheDocument();
    });

    it("should be able to close media viewer", () => {
        function MockComponent() {
            const { openMediaViewer, closeMediaViewer } = useMedia();

            return (
                <div data-testid="root">
                    <button onClick={() => openMediaViewer([], 0)}>Open</button>
                    <button onClick={() => closeMediaViewer()}>Close</button>
                </div>
            );
        }

        render(
            <ThemeProvider theme={theme}>
                <MediaProvider>
                    <MockComponent />
                </MediaProvider>
            </ThemeProvider>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();

        const openButton = screen.getByText("Open");
        expect(openButton).toBeInTheDocument();

        act(() => {
            openButton.click();
        });

        const closeButton = screen.getByText("Close");
        expect(closeButton).toBeInTheDocument();

        act(() => {
            closeButton.click();
        });

        const mediaViewerWrapper = screen.getByTestId("media-viewer-backdrop");

        expect(mediaViewerWrapper).toHaveStyle({
            opacity: "0",
        });
    });
});
