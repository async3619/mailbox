import { isMastodonTempAuthData } from "./constants";

describe("isMastodonTempAuthData()", () => {
    it("should return false when given data is not valid", () => {
        expect(isMastodonTempAuthData({})).toBe(false);
        expect(isMastodonTempAuthData({ type: "invalid" })).toBe(false);
        expect(isMastodonTempAuthData({ type: "mastodon" })).toBe(false);
    });

    it("should return true when given data is valid", () => {
        expect(
            isMastodonTempAuthData({
                id: "1",
                name: "name",
                client_id: "client_id",
                client_secret: "client_secret",
                redirect_uri: "redirect_uri",
                website: "website",
                instanceUrl: "instanceUrl",
            }),
        ).toBe(true);
    });
});
