import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";

import { MediaViewer } from "@components/Media/Viewer";
import { act, fireEvent, render, screen } from "@testing-library/react";

describe("<MediaViewer />", () => {
    it("should render MediaViewer properly", () => {
        render(
            <ThemeProvider theme={theme}>
                <MediaViewer open attachments={[]} index={0} onClose={jest.fn()} onClosed={jest.fn()} />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer");
        expect(root).toBeInTheDocument();
    });

    it("should be able to close media viewer", async () => {
        const onClose = jest.fn();
        const onClosed = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <MediaViewer open attachments={[]} index={0} onClose={onClose} onClosed={onClosed} />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer");
        expect(root).toBeInTheDocument();

        act(() => {
            root.click();
        });

        expect(onClose).toBeCalledTimes(1);
    });

    it("should be able to close media viewer with escape key", async () => {
        const onClose = jest.fn();
        const onClosed = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <MediaViewer open attachments={[]} index={0} onClose={onClose} onClosed={onClosed} />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer");
        expect(root).toBeInTheDocument();

        act(() => {
            fireEvent.keyDown(root, { key: "Escape" });
        });

        expect(onClose).toBeCalledTimes(1);
    });

    it("should be able to navigate to next media", async () => {
        const onClose = jest.fn();
        const onClosed = jest.fn();
        const onIndexChange = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <MediaViewer
                    open
                    attachments={[
                        { type: "image", url: "", previewUrl: "" },
                        { type: "image", url: "", previewUrl: "" },
                    ]}
                    index={0}
                    onIndexChange={onIndexChange}
                    onClose={onClose}
                    onClosed={onClosed}
                />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer");
        expect(root).toBeInTheDocument();

        act(() => {
            root.click();
        });

        const nextButton = screen.getByLabelText("Next Media");
        expect(nextButton).toBeInTheDocument();

        act(() => {
            nextButton.click();
        });

        expect(onIndexChange).toBeCalledTimes(1);
    });

    it("should be able to navigate to previous media", async () => {
        const onClose = jest.fn();
        const onClosed = jest.fn();
        const onIndexChange = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <MediaViewer
                    open
                    attachments={[
                        { type: "image", url: "", previewUrl: "" },
                        { type: "image", url: "", previewUrl: "" },
                    ]}
                    index={1}
                    onClose={onClose}
                    onClosed={onClosed}
                />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer");
        expect(root).toBeInTheDocument();

        act(() => {
            root.click();
        });

        const prevButton = screen.getByLabelText("Previous Media");
        expect(prevButton).toBeInTheDocument();

        act(() => {
            prevButton.click();
        });

        expect(onIndexChange).toBeCalledTimes(0);
    });

    it("should be able to navigate to next media with right arrow key", async () => {
        const onClose = jest.fn();
        const onClosed = jest.fn();
        const onIndexChange = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <MediaViewer
                    open
                    attachments={[
                        { type: "image", url: "", previewUrl: "" },
                        { type: "image", url: "", previewUrl: "" },
                    ]}
                    index={0}
                    onClose={onClose}
                    onClosed={onClosed}
                    onIndexChange={onIndexChange}
                />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer");
        expect(root).toBeInTheDocument();

        act(() => {
            fireEvent.keyDown(root, { key: "ArrowRight" });
        });

        expect(onIndexChange).toBeCalledTimes(1);
    });

    it("should be able to navigate to previous media with left arrow key", async () => {
        const onClose = jest.fn();
        const onClosed = jest.fn();
        const onIndexChange = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <MediaViewer
                    open
                    attachments={[
                        { type: "image", url: "", previewUrl: "" },
                        { type: "image", url: "", previewUrl: "" },
                    ]}
                    index={1}
                    onClose={onClose}
                    onClosed={onClosed}
                    onIndexChange={onIndexChange}
                />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer");
        expect(root).toBeInTheDocument();

        act(() => {
            fireEvent.keyDown(root, { key: "ArrowLeft" });
        });

        expect(onIndexChange).toBeCalledTimes(1);
    });

    it("should be able to expand media", async () => {
        const onClose = jest.fn();
        const onClosed = jest.fn();

        render(
            <ThemeProvider theme={theme}>
                <MediaViewer open attachments={[]} index={0} onClose={onClose} onClosed={onClosed} />
            </ThemeProvider>,
        );

        const root = screen.getByTestId("media-viewer");
        expect(root).toBeInTheDocument();

        const expand = screen.getByLabelText("Expand Media");
        expect(expand).toBeInTheDocument();

        act(() => {
            expand.click();
        });

        const shrink = screen.getByLabelText("Shrink Media");
        expect(shrink).toBeInTheDocument();
    });
});
