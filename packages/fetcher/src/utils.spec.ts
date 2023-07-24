import { getErrorMessage } from "./utils";

describe("getErrorMessage()", () => {
    it("should return the error message if the error is a string", () => {
        expect(getErrorMessage("error")).toBe("error");
    });

    it("should return the error message if the error is an Error", () => {
        expect(getErrorMessage(new Error("error"))).toBe("error");
    });

    it("should return the error message if the error is an Error with a cause", () => {
        class CustomError extends Error {
            public cause: unknown;

            constructor(message: string, cause: unknown) {
                super(message);
                this.cause = cause;
            }
        }

        const error = new CustomError("error", new Error("cause"));

        expect(getErrorMessage(error)).toBe("cause");
    });

    it("should return 'Unknown error' if the error is not a string or an Error", () => {
        expect(getErrorMessage({})).toBe("Unknown error");
    });
});
