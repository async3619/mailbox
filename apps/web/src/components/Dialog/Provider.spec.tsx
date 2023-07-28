import { act, render, screen } from "@testing-library/react";
import { DialogProvider } from "@components/Dialog/Provider";
import { useDialog } from "@components/Dialog";

function MockComponent() {
    const { showDialog, showBackdrop, hideBackdrop } = useDialog();

    return (
        <>
            <div
                data-testid="mock-component"
                onClick={() => showDialog(() => <div data-testid="mock-dialog">MOCK_DIALOG</div>)}
            />
            <div
                data-testid="show-dialog"
                onClick={() => {
                    return showDialog(({ onClose, onClosed }) => (
                        <div data-testid="mock-dialog">
                            <div data-testid="onClose" onClick={onClose} />
                            <div data-testid="onClosed" onClick={onClosed} />
                        </div>
                    ));
                }}
            />
            <div data-testid="show-backdrop" onClick={showBackdrop} />
            <div data-testid="hide-backdrop" onClick={hideBackdrop} />
        </>
    );
}

describe("<DialogProvider />", () => {
    it("should render DialogProvider properly", () => {
        render(
            <DialogProvider>
                <div data-testid="root" />
            </DialogProvider>,
        );

        const root = screen.getByTestId("root");
        expect(root).toBeInTheDocument();
    });

    it("should be able to show dialog", async () => {
        render(
            <DialogProvider>
                <MockComponent />
            </DialogProvider>,
        );

        const mockComponent = screen.getByTestId("mock-component");
        expect(mockComponent).toBeInTheDocument();

        act(() => mockComponent.click());

        const mockDialog = await screen.findByTestId("mock-dialog");
        expect(mockDialog).toBeInTheDocument();
    });

    it("should be able to close dialog", async () => {
        render(
            <DialogProvider>
                <MockComponent />
            </DialogProvider>,
        );

        const showDialog = screen.getByTestId("show-dialog");
        await act(() => showDialog.click());

        const onClose = screen.getByTestId("onClose");
        const onClosed = screen.getByTestId("onClosed");

        await act(() => onClose.click());
        await act(() => onClosed.click());

        const mockDialog = screen.queryByTestId("mock-dialog");
        expect(mockDialog).not.toBeInTheDocument();
    });

    it("should be able to show and hide backdrop", async () => {
        const context = render(
            <DialogProvider>
                <MockComponent />
            </DialogProvider>,
        );

        const showBackdrop = screen.getByTestId("show-backdrop");
        const hideBackdrop = screen.getByTestId("hide-backdrop");

        await act(() => showBackdrop.click());

        const backdrop = context.container.querySelector(".MuiBackdrop-root");
        expect(backdrop).toHaveStyle({
            opacity: "1",
        });

        await act(() => hideBackdrop.click());

        expect(backdrop).toHaveStyle({
            opacity: "0",
        });
    });
});
