import { Test, TestingModule } from "@nestjs/testing";

import { EmojiResolver } from "@emoji/emoji.resolver";
import { EmojiService } from "@emoji/emoji.service";

describe("EmojiResolver", () => {
    let resolver: EmojiResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmojiResolver, { provide: EmojiService, useValue: {} }],
        }).compile();

        resolver = module.get<EmojiResolver>(EmojiResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });

    it("should be able to get emojis", async () => {
        const service = resolver["emojiService"];
        service.getEmojis = jest.fn().mockResolvedValue([]);

        const emojis = await resolver.emojis();

        expect(service.getEmojis).toBeCalledTimes(1);
        expect(emojis).toBeDefined();
    });

    it("should be able to invalidate emojis", async () => {
        const service = resolver["emojiService"];
        service.invalidateEmojis = jest.fn().mockResolvedValue(true);

        const result = await resolver.invalidateEmojis([]);

        expect(service.invalidateEmojis).toBeCalledTimes(1);
        expect(result).toBe(true);
    });
});
