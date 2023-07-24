import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";

import { EmojiService } from "@emoji/emoji.service";
import { CustomEmoji } from "@emoji/models/custom-emoji.model";

describe("EmojiService", () => {
    let service: EmojiService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EmojiService, { provide: getRepositoryToken(CustomEmoji), useValue: {} }],
        }).compile();

        service = module.get<EmojiService>(EmojiService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
