import { getClosestIndex } from "@utils/closest";

describe("getClosestIndex()", () => {
    it("should return the closest index in given array", () => {
        expect(getClosestIndex([1, 2, 6, 7, 5], 3)).toBe(4);
    });

    it("should return the closest index in given array (backwards)", () => {
        expect(getClosestIndex([1, 2, 6, 7, 5], 3, true)).toBe(1);
    });
});
