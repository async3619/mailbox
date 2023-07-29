import { AccountHydrator } from "./hydrator";
import { BaseAccount } from "./account";

describe("AccountHydrator class", () => {
    it("should throw error when given data is not valid for given account type", async () => {
        class MockHydrator extends AccountHydrator<BaseAccount<string>> {
            public validate(data: Record<string, unknown>): data is Record<string, unknown> {
                return false;
            }

            public hydrate(): Promise<BaseAccount<string>> {
                throw new Error("Method not implemented.");
            }
        }

        expect(() => new MockHydrator({})).toThrowError("Invalid data");
    });
});
