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
});
