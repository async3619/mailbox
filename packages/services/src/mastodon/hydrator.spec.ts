import { MastodonAccountHydrator } from "./hydrator";
import { MastodonAccount } from "./account";

jest.mock("masto", () => ({
    login: jest.fn().mockResolvedValue({
        v1: {
            accounts: {
                verifyCredentials: jest.fn().mockResolvedValue({}),
            },
        },
    }),
}));

describe("MastodonAccountHydrator class", () => {
    it("should throw error when given data is not valid serialized mastodon account data", async () => {
        expect(() => new MastodonAccountHydrator({})).toThrowError("Invalid data");
    });

    it("should be able to hydrate serialized mastodon account data", async () => {
        const hydrator = new MastodonAccountHydrator({
            serviceType: "mastodon",
            instanceUrl: "instanceUrl",
            token: {
                access_token: "",
                token_type: "",
                scope: "",
                created_at: 0,
            },
        });

        const account = await hydrator.hydrate();

        expect(account).toBeDefined();
        expect(account).toBeInstanceOf(MastodonAccount);
    });
});
