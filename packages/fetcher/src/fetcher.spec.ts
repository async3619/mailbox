import { APIRouteMap, Fetcher } from "./fetcher";

describe("Fetcher class", () => {
    let fetchFn: jest.Mock;
    let fetcher: Fetcher<APIRouteMap>;

    beforeEach(() => {
        fetcher = new Fetcher("https://example.com");
        fetchFn = jest.fn().mockImplementation(() => Promise.resolve(new Response()));

        Object.defineProperty(Fetcher, "fetcher", {
            get: () => fetchFn,
        });

        // prevent console.warn from being called
        jest.spyOn(console, "warn").mockImplementation(jest.fn());
    });

    it("should be instantiable", () => {
        expect(fetcher).toBeInstanceOf(Fetcher);
        expect(fetcher["baseUrl"]).toBe("https://example.com");
    });

    it("should be able to fetch", async () => {
        const response = await fetcher.fetch("/test");

        expect(response).toBeInstanceOf(Response);
        expect(fetchFn).toBeCalledWith("https://example.com/test", {
            method: "GET",
            headers: {},
            body: undefined,
        });
    });

    it("should be able to fetch with body (json)", async () => {
        const response = await fetcher.fetch("/test", {
            method: "POST",
            body: { test: "test" },
        });

        expect(response).toBeInstanceOf(Response);
        expect(fetchFn).toBeCalledWith("https://example.com/test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test: "test" }),
        });

        const response2 = await fetcher.fetch("/test", {
            method: "POST",
            body: { test: "test" },
            bodyType: "json",
        });

        expect(response2).toBeInstanceOf(Response);
        expect(fetchFn).toBeCalledWith("https://example.com/test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test: "test" }),
        });
    });

    it("should be able to fetch with body (form)", async () => {
        const response = await fetcher.fetch("/test", {
            method: "POST",
            body: { test: "test" },
            bodyType: "form",
        });

        expect(response).toBeInstanceOf(Response);
        expect(fetchFn).toBeCalledWith("https://example.com/test", {
            method: "POST",
            headers: {},
            body: expect.any(FormData),
        });
    });

    it("should be able to fetch with headers", async () => {
        const response = await fetcher.fetch("/test", {
            method: "GET",
            headers: {
                "X-Test": "test",
            },
        });

        expect(response).toBeInstanceOf(Response);
        expect(fetchFn).toBeCalledWith("https://example.com/test", {
            method: "GET",
            headers: { "X-Test": "test" },
            body: undefined,
        });
    });

    it("should throw an error if the response is not ok", async () => {
        fetchFn.mockImplementationOnce(() =>
            Promise.resolve(new Response(null, { status: 404, statusText: "Not Found" })),
        );

        await expect(
            fetcher.fetch("/test", {
                method: "GET",
                throwOnHttpCodes: [404],
            }),
        ).rejects.toThrowError("404 Not Found");
    });

    it("should ignore HTTP errors if option is set", async () => {
        fetchFn.mockImplementationOnce(() =>
            Promise.resolve(new Response(null, { status: 404, statusText: "Not Found" })),
        );

        const response = await fetcher.fetch("/test", {
            method: "GET",
            ignoreHTTPError: true,
            retryCount: 0,
        });

        expect(response).toBeInstanceOf(Response);
    });

    it("should retry if an error occurs", async () => {
        fetchFn.mockImplementation(() => Promise.reject(new Error("error")));

        await expect(
            fetcher.fetch("/test", {
                method: "GET",
                retryCount: 1,
                retryDelay: 0,
            }),
        ).rejects.toThrowError("error");

        expect(fetchFn).toBeCalledTimes(2);
    });

    it("should retry with delay if an error occurs", async () => {
        fetchFn.mockImplementation(() => Promise.reject(new Error("error")));

        const start = Date.now();

        await expect(
            fetcher.fetch("/test", {
                method: "GET",
                retryCount: 1,
                retryDelay: 1000,
            }),
        ).rejects.toThrowError("error");

        const end = Date.now();

        expect(fetchFn).toBeCalledTimes(2);
        expect(end - start).toBeGreaterThanOrEqual(1000);
    });

    it("should able to fetch json", async () => {
        fetchFn.mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ test: "test" }))));

        const json = await fetcher.fetchJson("/test");

        expect(json).toEqual({ test: "test" });
    });
});
