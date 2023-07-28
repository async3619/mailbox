import { act, render, screen } from "@testing-library/react";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";
import { BaseColumn } from "@components/Column/Base";
import { AttachmentList } from "@components/Timeline/AttachmentList";
import { MediaProvider } from "@components/Media/Provider";
import { PostAttachment } from "@services/types";

import { MOCK_ATTACHMENT, MOCK_COLUMN, MOCK_TIMELINE_POST } from "../../../__tests__/fixture";

interface ContentProps {
    attachments: PostAttachment[];
}

function Content({ attachments }: ContentProps) {
    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <MediaProvider>
                    <BaseColumn instance={MOCK_COLUMN}>
                        <AttachmentList post={MOCK_TIMELINE_POST} attachments={attachments} />
                    </BaseColumn>
                </MediaProvider>
            </ThemeProvider>
        </RecoilRoot>
    );
}

describe("<AttachmentList />", () => {
    it("should render AttachmentList properly", async () => {
        render(<Content attachments={[MOCK_ATTACHMENT]} />);

        const root = screen.getByTestId("attachment-list");
        expect(root).toBeInTheDocument();
    });

    it("should be able to render multiple attachments", async () => {
        const twoItems = render(
            <Content attachments={[MOCK_ATTACHMENT, MOCK_ATTACHMENT]} />,
        ).container.querySelectorAll("[data-testid='attachment-view']");

        expect(twoItems.length).toBe(2);

        const threeItems = render(
            <Content attachments={[MOCK_ATTACHMENT, MOCK_ATTACHMENT, MOCK_ATTACHMENT]} />,
        ).container.querySelectorAll("[data-testid='attachment-view']");

        expect(threeItems.length).toBe(3);

        const fourItems = render(
            <Content attachments={[MOCK_ATTACHMENT, MOCK_ATTACHMENT, MOCK_ATTACHMENT, MOCK_ATTACHMENT]} />,
        ).container.querySelectorAll("[data-testid='attachment-view']");

        expect(fourItems.length).toBe(4);
    });

    it("should open media viewer if children is clicked", async () => {
        render(<Content attachments={[MOCK_ATTACHMENT]} />);

        const attachment = screen.getByTestId("attachment-view");

        act(() => {
            attachment.click();
        });

        const mediaViewerBackdrop = screen.getByTestId("media-viewer-backdrop");
        expect(mediaViewerBackdrop).toBeInTheDocument();
        expect(mediaViewerBackdrop).toHaveStyle("opacity: 1");
    });
});
