import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { theme } from "@styles/theme";

import { DrawerMenuProvider } from "@components/DrawerMenu/Provider";
import { useDrawerMenu } from "@components/DrawerMenu/index";
import { BaseDrawerMenuProps } from "@components/DrawerMenu/Base";

interface MockDrawerMenuProps extends BaseDrawerMenuProps {}
interface MockComponentProps {
    MockDrawerMenu: React.ComponentType<MockDrawerMenuProps>;
}

function MockComponent({ MockDrawerMenu }: MockComponentProps) {
    const { showDrawerMenu } = useDrawerMenu();

    return <button data-testid="button" onClick={() => showDrawerMenu(MockDrawerMenu)} />;
}

function Content({ children }: React.PropsWithChildren) {
    return (
        <ThemeProvider theme={theme}>
            <DrawerMenuProvider>
                {drawerMenuNode => (
                    <>
                        {children}
                        {drawerMenuNode}
                    </>
                )}
            </DrawerMenuProvider>
        </ThemeProvider>
    );
}

describe("<DrawerMenuProvider />", () => {
    it("should render DrawerMenuProvider properly", async () => {
        render(
            <ThemeProvider theme={theme}>
                <DrawerMenuProvider>{() => <div data-testid="drawer-menu-provider" />}</DrawerMenuProvider>
            </ThemeProvider>,
        );

        const root = screen.getByTestId("drawer-menu-provider");
        expect(root).toBeInTheDocument();
    });

    it("should be able to open drawer menu", () => {
        function MockDrawerMenu({}: MockDrawerMenuProps) {
            return <div data-testid="drawer-menu" />;
        }

        render(
            <Content>
                <MockComponent MockDrawerMenu={MockDrawerMenu} />
            </Content>,
        );

        const button = screen.getByTestId("button");
        expect(button).toBeInTheDocument();

        act(() => {
            button.click();
        });

        const drawerMenu = screen.getByTestId("drawer-menu");
        expect(drawerMenu).toBeInTheDocument();
    });

    it("should mark drawer menu as not open when onClose is called", () => {
        function MockDrawerMenu({ close, open }: MockDrawerMenuProps) {
            return (
                <div data-testid="drawer-menu" onClick={close}>
                    {open ? "open" : "closed"}
                </div>
            );
        }

        render(
            <Content>
                <MockComponent MockDrawerMenu={MockDrawerMenu} />
            </Content>,
        );

        const button = screen.getByTestId("button");
        expect(button).toBeInTheDocument();

        act(() => {
            button.click();
        });

        const drawerMenu = screen.getByTestId("drawer-menu");
        expect(drawerMenu).toBeInTheDocument();
        expect(drawerMenu).toHaveTextContent("open");

        act(() => {
            drawerMenu.click();
        });

        expect(drawerMenu).toHaveTextContent("closed");
    });

    it("should close drawer menu when onClosed is called", () => {
        function MockDrawerMenu({ onClosed }: MockDrawerMenuProps) {
            return <div data-testid="drawer-menu" onClick={onClosed} />;
        }

        render(
            <Content>
                <MockComponent MockDrawerMenu={MockDrawerMenu} />
            </Content>,
        );

        const button = screen.getByTestId("button");
        expect(button).toBeInTheDocument();

        act(() => {
            button.click();
        });

        const drawerMenu = screen.getByTestId("drawer-menu");
        expect(drawerMenu).toBeInTheDocument();

        act(() => {
            drawerMenu.click();
        });

        expect(drawerMenu).not.toBeInTheDocument();
    });
});
