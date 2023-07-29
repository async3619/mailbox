/* eslint-disable @typescript-eslint/no-explicit-any */
import { MastodonAuth } from "./auth";
import { MASTODON_TEMP_AUTH_KEY } from "./constants";

describe("MastodonAuth class", () => {
    let auth: MastodonAuth;

    beforeEach(() => {
        auth = new MastodonAuth("");
        Object.defineProperty(auth, "fetcher", {
            value: {
                fetchJson: jest.fn().mockResolvedValue({}),
            },
        });
    });

    it("should be able to instantiate", () => {
        expect(auth).toBeInstanceOf(MastodonAuth);
    });

    it("should be able to create oauth app", async () => {
        await auth.createApplication("test", "urn:ietf:wg:oauth:2.0:oob", "read write follow", "http://localhost");

        expect(auth["fetcher"]["fetchJson"]).toBeCalledWith("/api/v1/apps", {
            method: "POST",
            ignoreHTTPError: true,
            body: {
                client_name: "test",
                redirect_uris: "urn:ietf:wg:oauth:2.0:oob",
                scopes: "read write follow",
                website: "http://localhost",
            },
        });
    });

    it("should be able to get oauth token", async () => {
        await auth.getToken("clientId", "clientSecret", "urn:ietf:wg:oauth:2.0:oob", "authorization_code");

        expect(auth["fetcher"]["fetchJson"]).toBeCalledWith("/oauth/token", {
            method: "POST",
            ignoreHTTPError: true,
            body: {
                client_id: "clientId",
                client_secret: "clientSecret",
                redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
                code: "authorization_code",
                grant_type: "authorization_code",
            },
            query: {
                client_id: "clientId",
                client_secret: "clientSecret",
                redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
                code: "authorization_code",
                grant_type: "authorization_code",
            },
        });
    });

    it("should be able to get login url", () => {
        const clientId = "clientid";
        const redirectUrl = "redirectUrl";
        const scope = encodeURIComponent("read write follow");
        const loginUrl = auth.getLoginUrl(clientId, redirectUrl);

        expect(loginUrl).toBe(
            `https:///oauth/authorize?scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(
                redirectUrl,
            )}&client_id=${clientId}&force_login=true`,
        );
    });

    it("should be able to redirect to login page", () => {
        const clientId = "clientId";
        const redirectUrl = "redirectUrl";
        const data = {
            client_id: clientId,
            redirect_uri: redirectUrl,
            client_secret: "clientSecret",
            website: "website",
            name: "name",
            id: "id",
        };

        auth.redirectLogin(data);

        const loginUrl = auth.getLoginUrl(clientId, redirectUrl);
        expect(global.localStorage.setItem).toBeCalledWith(
            MASTODON_TEMP_AUTH_KEY,
            JSON.stringify({ instanceUrl: auth["instanceUrl"], ...data }),
        );

        expect(global.location.href).toBe(loginUrl);
    });
});
