import { Fetcher } from "fetcher";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { EmojiService } from "@emoji/emoji.service";
import { CustomEmoji } from "@emoji/models/custom-emoji.model";

describe("EmojiService", () => {
    let service: EmojiService;
    let fetcher: typeof fetch;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmojiService,
                {
                    provide: getRepositoryToken(CustomEmoji),
                    useValue: {
                        find: jest.fn(),
                        create: jest.fn().mockResolvedValue({}),
                        delete: jest.fn(),
                        insert: jest.fn(),
                    },
                },
            ],
        }).compile();

        fetcher = jest.fn();
        Object.defineProperty(Fetcher, "fetcher", {
            get: jest.fn(() => fetcher),
        });

        service = module.get<EmojiService>(EmojiService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should be able to get emojis", async () => {
        const repository = service["customEmojiRepository"];
        const emojis = await service.getEmojis();

        expect(repository.find).toBeCalledTimes(1);
        expect(emojis).toBeDefined();
    });

    it("should group emojis by instance", async () => {
        const repository = service["customEmojiRepository"];
        repository.find = jest.fn().mockResolvedValue([{ instance: "facebook.com" }, { instance: "twitter.com" }]);

        const emojis = await service.getEmojis();

        expect(emojis).toHaveLength(2);
        expect(emojis[0].instance).toBe("facebook.com");
        expect(emojis[1].instance).toBe("twitter.com");
    });

    it("should be able to invalidate emojis for Mastodon instances", async () => {
        fetcher = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue([
                {
                    shortcode: "test",
                    url: "test",
                    static_url: "test",
                },
            ]),
        });

        await expect(service.getMastodonCustomEmojis("https://example.com")).resolves.toHaveLength(1);

        // invalid response
        fetcher = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                invalid: "response",
            }),
        });

        await expect(service.getMastodonCustomEmojis("https://example.com")).rejects.toThrowError(
            "API endpoint returned invalid Mastodon Emoji API response",
        );
    });

    it("should be able to invalidate emojis for Misskey v12.x instances", async () => {
        // v12.x uses `/api/meta` endpoint for custom emojis
        fetcher = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                version: "12.0.0",
                emojis: [{ name: "test", category: "test", url: "test" }],
            }),
        });

        await expect(service.getMisskeyCustomEmojis("https://example.com")).resolves.toHaveLength(1);

        // invalid response
        fetcher = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                emojis: [{ name: "test", category: "test", url: "test" }],
            }),
        });

        await expect(service.getMisskeyCustomEmojis("https://example.com")).resolves.toHaveLength(1);

        // fetcher should be called twice since it would fallback to v13.x
        expect(fetcher).toBeCalledTimes(2);
    });

    it("should be able to invalidate emojis for Misskey v13.x instances", async () => {
        // v13.x uses `/api/emojis` endpoint for custom emojis
        fetcher = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                emojis: [{ name: "test", category: "test", url: "test" }],
            }),
        });

        await expect(service.getMisskeyCustomEmojis("https://example.com")).resolves.toHaveLength(1);

        // invalid response
        fetcher = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                invalid: "response",
            }),
        });

        await expect(service.getMisskeyCustomEmojis("https://example.com")).rejects.toThrowError(
            "API endpoint returned invalid Misskey Emoji API response",
        );
    });

    it("should be able to invalidate emojis", async () => {
        service["getMisskeyCustomEmojis"] = jest.fn().mockResolvedValue([]);
        service["getMastodonCustomEmojis"] = jest.fn().mockResolvedValue([]);

        await expect(service.invalidateEmojis(["https://example.com"])).resolves.toBe(true);
        expect(service["getMisskeyCustomEmojis"]).toBeCalledTimes(1);
        expect(service["getMastodonCustomEmojis"]).toBeCalledTimes(1);
    });

    it("should print errors when invalidating emojis failed", async () => {
        console.error = jest.fn();
        const mockedError = new Error("test");

        service["getMisskeyCustomEmojis"] = jest.fn().mockRejectedValue(mockedError);
        service["getMastodonCustomEmojis"] = jest.fn().mockRejectedValue(mockedError);

        await expect(service.invalidateEmojis(["https://example.com"])).rejects.toThrowError(
            "Given instance url is not a valid Mastodon or Misskey instance: https://example.com",
        );

        expect(console.error).toBeCalledTimes(2);
        expect(console.error).toBeCalledWith(mockedError);
    });

    it("should batch emoji invalidation tasks", async () => {
        const mockedProcess = jest.fn().mockImplementation(async () => {
            await new Promise(res => setTimeout(res, 100));
            return [];
        });

        service["getMisskeyCustomEmojis"] = mockedProcess;
        service["getMastodonCustomEmojis"] = mockedProcess;

        await Promise.all([
            expect(service.invalidateEmojis(["https://example.com"])).resolves.toBe(true),
            expect(service.invalidateEmojis(["https://example.com"])).resolves.toBe(true),
            expect(service.invalidateEmojis(["https://example.com"])).resolves.toBe(true),
        ]);

        expect(mockedProcess).toBeCalledTimes(2);
    });
});
