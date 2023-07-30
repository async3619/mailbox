import React from "react";
import { RecoilRoot, RecoilValue, useRecoilValue } from "recoil";
import { act, render, screen } from "@testing-library/react";

import { createTheme, ThemeProvider } from "@mui/material";
import { ColumnInstance } from "@components/Column/types";
import { ColumnSettingsSidebar } from "@components/Column/Sidebar/Settings/Column";
import { columnState } from "@states/columns";

interface RecoilObserverProps<T> {
    node: RecoilValue<T>;
    onChange: (value: T) => void;
}

function RecoilObserver<T>({ node, onChange }: RecoilObserverProps<T>) {
    const value = useRecoilValue(node);
    React.useEffect(() => onChange(value), [onChange, value]);

    return null;
}

describe("<ColumnSettingsSidebar />", () => {
    it("should render ColumnSettingsSidebar properly", () => {
        const instance: ColumnInstance = {} as ColumnInstance;

        render(
            <RecoilRoot>
                <ThemeProvider theme={createTheme()}>
                    <ColumnSettingsSidebar instance={instance} />
                </ThemeProvider>
            </RecoilRoot>,
        );
    });

    it("should update column size properly", () => {
        const instance: ColumnInstance = { id: "1" } as ColumnInstance;
        const handleColumnUpdated = jest.fn();

        render(
            <RecoilRoot
                initializeState={snapshot => {
                    snapshot.set(columnState, [instance]);
                }}
            >
                <ThemeProvider theme={createTheme()}>
                    <RecoilObserver node={columnState} onChange={handleColumnUpdated} />
                    <ColumnSettingsSidebar instance={instance} />
                </ThemeProvider>
            </RecoilRoot>,
        );

        const sizeButton = screen.getByText("columns.settings.size.medium");
        expect(sizeButton).toBeInTheDocument();

        act(() => {
            sizeButton.click();
        });

        expect(handleColumnUpdated).toBeCalledTimes(2);
        expect(handleColumnUpdated).toHaveBeenNthCalledWith(1, [expect.objectContaining({ id: "1" })]);
        expect(handleColumnUpdated).toHaveBeenNthCalledWith(2, [expect.objectContaining({ id: "1", size: "medium" })]);
    });

    it("should update image preview size properly", () => {
        const instance: ColumnInstance = { id: "1" } as ColumnInstance;
        const handleColumnUpdated = jest.fn();

        render(
            <RecoilRoot
                initializeState={snapshot => {
                    snapshot.set(columnState, [instance]);
                }}
            >
                <ThemeProvider theme={createTheme()}>
                    <RecoilObserver node={columnState} onChange={handleColumnUpdated} />
                    <ColumnSettingsSidebar instance={instance} />
                </ThemeProvider>
            </RecoilRoot>,
        );

        const sizeButton = screen.getByText("columns.settings.previewRatio.rectangle");
        expect(sizeButton).toBeInTheDocument();

        act(() => {
            sizeButton.click();
        });

        expect(handleColumnUpdated).toBeCalledTimes(2);
        expect(handleColumnUpdated).toHaveBeenNthCalledWith(1, [expect.objectContaining({ id: "1" })]);
        expect(handleColumnUpdated).toHaveBeenNthCalledWith(2, [
            expect.objectContaining({ id: "1", imagePreviewSize: "rectangle" }),
        ]);
    });

    it("should update sensitive blurring properly", () => {
        const instance: ColumnInstance = { id: "1" } as ColumnInstance;
        const handleColumnUpdated = jest.fn();

        render(
            <RecoilRoot
                initializeState={snapshot => {
                    snapshot.set(columnState, [instance]);
                }}
            >
                <ThemeProvider theme={createTheme()}>
                    <RecoilObserver node={columnState} onChange={handleColumnUpdated} />
                    <ColumnSettingsSidebar instance={instance} />
                </ThemeProvider>
            </RecoilRoot>,
        );

        const sizeButton = screen.getByText("columns.settings.sensitiveImages.show");
        expect(sizeButton).toBeInTheDocument();

        act(() => {
            sizeButton.click();
        });

        expect(handleColumnUpdated).toBeCalledTimes(2);
        expect(handleColumnUpdated).toHaveBeenNthCalledWith(1, [expect.objectContaining({ id: "1" })]);
        expect(handleColumnUpdated).toHaveBeenNthCalledWith(2, [
            expect.objectContaining({ id: "1", sensitiveBlurring: "withoutBlur" }),
        ]);
    });
});
