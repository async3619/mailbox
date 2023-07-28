import { RecoilRoot } from "recoil";
import { Scrollbars } from "rc-scrollbars";

import { createTheme, ThemeProvider } from "@mui/material";
import { fireEvent, render, screen } from "@testing-library/react";

import { ColumnContainer } from "@components/Column/Container";
import { LayoutContext } from "@components/Layout/context";
import { ColumnInstance } from "@components/Column/types";
import { columnNodeState } from "@states/columns";

interface WheelTestComponentProps {
    scrollLeftFn?: () => void;
    getScrollLeftFn?: () => void;
}

function WheelTestComponent({ scrollLeftFn, getScrollLeftFn }: WheelTestComponentProps) {
    const columns = Array.from(new Array(15), (_, index) => ({ id: `${index}` })) as ColumnInstance[];
    const columnNodes = Object.fromEntries(
        columns.map((_, index) => [`${index}`, { offsetLeft: index * 300 } as HTMLElement]),
    );

    return (
        <RecoilRoot
            initializeState={snapshot => {
                snapshot.set(columnNodeState, columnNodes);
            }}
        >
            <LayoutContext.Provider
                value={{
                    scroller: {
                        scrollLeft: scrollLeftFn,
                        getScrollLeft: getScrollLeftFn,
                    } as unknown as Scrollbars,
                }}
            >
                <ThemeProvider theme={createTheme()}>
                    <ColumnContainer columns={columns} setColumns={jest.fn()} />
                </ThemeProvider>
            </LayoutContext.Provider>
        </RecoilRoot>
    );
}

describe("<ColumnContainer />", () => {
    it("should render ColumnContainer properly", () => {
        render(
            <RecoilRoot>
                <LayoutContext.Provider value={{ scroller: null }}>
                    <ThemeProvider theme={createTheme()}>
                        <ColumnContainer columns={[{ id: "1" }] as ColumnInstance[]} setColumns={jest.fn()} />
                    </ThemeProvider>
                </LayoutContext.Provider>
            </RecoilRoot>,
        );

        const column = screen.getByTestId("column-1");
        expect(column).toBeInTheDocument();
    });

    it("should render column instances properly", () => {
        const columns = [{ id: "1" }, { id: "2" }] as ColumnInstance[];

        render(
            <RecoilRoot>
                <LayoutContext.Provider value={{ scroller: null }}>
                    <ThemeProvider theme={createTheme()}>
                        <ColumnContainer columns={columns} setColumns={jest.fn()} />
                    </ThemeProvider>
                </LayoutContext.Provider>
            </RecoilRoot>,
        );

        expect(document.querySelectorAll('[data-testid*="column-"]').length).toBe(2);
    });

    it("should adjust scrollX position on wheel moved with alt key pressed", () => {
        const scrollLeftFn = jest.fn();
        const getScrollLeftFn = jest.fn(() => 0);

        render(<WheelTestComponent getScrollLeftFn={getScrollLeftFn} scrollLeftFn={scrollLeftFn} />);

        fireEvent.wheel(document, { deltaY: 100, altKey: true });

        expect(getScrollLeftFn).toBeCalledTimes(1);
        expect(scrollLeftFn).toBeCalledTimes(1);
        expect(scrollLeftFn).toBeCalledWith(300);
    });

    it("should not adjust scrollX position on wheel in some conditional mismatches", () => {
        const scrollLeftFn = jest.fn();
        const getScrollLeftFn = jest.fn(() => 0);

        render(<WheelTestComponent getScrollLeftFn={getScrollLeftFn} scrollLeftFn={scrollLeftFn} />);

        // no alt key pressed
        fireEvent.wheel(document, { deltaY: 100, altKey: false });

        expect(getScrollLeftFn).toBeCalledTimes(0);
        expect(scrollLeftFn).toBeCalledTimes(0);
    });
});
