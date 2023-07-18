import { Test, TestingModule } from "@nestjs/testing";
import { EmojiResolver } from "./emoji.resolver";

describe("EmojiResolver", () => {
    let resolver: EmojiResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmojiResolver],
        }).compile();

        resolver = module.get<EmojiResolver>(EmojiResolver);
    });

    it("should be defined", () => {
        expect(resolver).toBeDefined();
    });
});
