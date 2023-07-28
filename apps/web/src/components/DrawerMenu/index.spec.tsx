import { render } from "@testing-library/react";
import { DrawerMenuContext, useDrawerMenu } from "@components/DrawerMenu/index";

describe("useDrawerMenu()", () => {
    it("should throw error when useDrawerMenu is called outside of <DrawerMenuProvider />", () => {
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => null);

        function MockComponent() {
            useDrawerMenu();
            return null;
        }

        expect(() => {
            render(<MockComponent />);
        }).toThrowError();

        errorSpy.mockRestore();
    });

    it("should return drawer menu context values", () => {
        const showDrawerMenu = jest.fn();
        function MockComponent() {
            const context = useDrawerMenu();

            return <div data-testid="root">{context.showDrawerMenu === showDrawerMenu}</div>;
        }

        const { getByTestId } = render(
            <DrawerMenuContext.Provider value={{ showDrawerMenu }}>
                <MockComponent />
            </DrawerMenuContext.Provider>,
        );

        const root = getByTestId("root");
        expect(root).toBeInTheDocument();
    });
});
