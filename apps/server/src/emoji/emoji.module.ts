import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmojiService } from "@emoji/emoji.service";
import { EmojiResolver } from "@emoji/emoji.resolver";

import { CustomEmoji } from "@emoji/models/custom-emoji.model";

@Module({
    imports: [TypeOrmModule.forFeature([CustomEmoji])],
    providers: [EmojiService, EmojiResolver],
})
export class EmojiModule {}
