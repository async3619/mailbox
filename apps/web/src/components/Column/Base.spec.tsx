import React from "react";
import { RecoilRoot, RecoilValue, useRecoilValue } from "recoil";

import { createTheme, ThemeProvider } from "@mui/material";
import { act, render, screen } from "@testing-library/react";

import { BaseColumn } from "@components/Column/Base";
import { ColumnInstance } from "@components/Column/types";
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

describe("<BaseColumn />", () => {
    it("should render BaseColumn properly", () => {
        const instance: ColumnInstance = {} as ColumnInstance;

        render(
            <RecoilRoot>
                <ThemeProvider theme={createTheme()}>
                    <BaseColumn instance={instance}>
                        <div />
                    </BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );
    });

    it("should render children as a function properly", () => {
        const instance: ColumnInstance = {} as ColumnInstance;

        render(
            <RecoilRoot>
                <ThemeProvider theme={createTheme()}>
                    <BaseColumn instance={instance}>{() => <div data-testid="mock-content" />}</BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );

        expect(screen.getByTestId("mock-content")).toBeInTheDocument();
    });

    it("should show settings sidebar when settings button is clicked", () => {
        const instance: ColumnInstance = {} as ColumnInstance;

        render(
            <RecoilRoot>
                <ThemeProvider theme={createTheme()}>
                    <BaseColumn instance={instance}>
                        <div />
                    </BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const settingsButton = screen.getByLabelText("Column Settings");
        expect(settingsButton).toBeInTheDocument();

        act(() => {
            settingsButton.click();
        });

        expect(screen.getByText("Column Size")).toBeInTheDocument();
    });

    it("should delete column when delete button is clicked", () => {
        const instance: ColumnInstance = { id: "1" } as ColumnInstance;
        const handleColumnDeleted = jest.fn();

        render(
            <RecoilRoot
                initializeState={snapshot => {
                    snapshot.set(columnState, [instance]);
                }}
            >
                <ThemeProvider theme={createTheme()}>
                    <RecoilObserver node={columnState} onChange={handleColumnDeleted} />
                    <BaseColumn instance={instance}>
                        <div />
                    </BaseColumn>
                </ThemeProvider>
            </RecoilRoot>,
        );

        const deleteButton = screen.getByLabelText("Delete Column");
        expect(deleteButton).toBeInTheDocument();

        act(() => {
            deleteButton.click();
        });

        expect(handleColumnDeleted).toBeCalledTimes(2);
        expect(handleColumnDeleted).toHaveBeenNthCalledWith(1, [expect.objectContaining({ id: "1" })]);
        expect(handleColumnDeleted).toHaveBeenNthCalledWith(2, []);
    });
});
