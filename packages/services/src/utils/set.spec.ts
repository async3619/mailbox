import { ObservableSet } from "./set";

describe("ObservableSet class", () => {
    it("should be able to instantiate", () => {
        const set = new ObservableSet();
        expect(set).toBeDefined();
    });

    it("should be able to add item", () => {
        const set = new ObservableSet<number>();
        const listener = jest.fn();
        set.addEventListener("add", listener);
        set.add(1);

        expect(set.has(1)).toBeTruthy();
        expect(listener).toBeCalledWith(1);
    });

    it("should be able to delete item", () => {
        const set = new ObservableSet<number>();
        const listener = jest.fn();
        set.addEventListener("delete", listener);
        set.add(1);
        set.delete(1);

        expect(set.has(1)).toBeFalsy();
        expect(listener).toBeCalledWith(1);
    });

    it("should be able to check if item exists", () => {
        const set = new ObservableSet<number>();
        set.add(1);

        expect(set.has(1)).toBeTruthy();
        expect(set.has(2)).toBeFalsy();
    });

    it("should be able to add listener", () => {
        const set = new ObservableSet<number>();
        const listener = jest.fn();
        set.addEventListener("add", listener);

        set.add(1);

        expect(listener).toBeCalledWith(1);
    });

    it("should be able to remove listener", () => {
        const set = new ObservableSet<number>();
        const listener = jest.fn();
        set.addEventListener("add", listener);
        set.removeEventListener("add", listener);

        set.add(1);

        expect(listener).not.toBeCalled();
    });
});
