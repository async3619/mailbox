import { hydrateAccount } from "./hydrate";
import { AccountHydrator, BaseAccount } from "./base";

describe("hydrateAccount()", () => {
    it("should return empty array when given JSON is not an array", () => {
        expect(hydrateAccount("{}")).toHaveLength(0);
        expect(hydrateAccount("1")).toHaveLength(0);
        expect(hydrateAccount("true")).toHaveLength(0);
        expect(hydrateAccount("false")).toHaveLength(0);
        expect(hydrateAccount("null")).toHaveLength(0);
    });

    it("should be able to hydrate accounts from given JSON", () => {
        class MockHydrator extends AccountHydrator<BaseAccount<string>> {
            hydrate = jest.fn().mockResolvedValue({});
            validate(data: Record<string, unknown>): data is Record<string, unknown> {
                return true;
            }
        }

        const accounts = hydrateAccount(JSON.stringify([{ type: "mock" }]), [MockHydrator]);
        expect(accounts).toHaveLength(1);
        expect(accounts[0]).toBeInstanceOf(MockHydrator);
    });
});
