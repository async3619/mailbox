import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { EmojiService } from "@emoji/emoji.service";

import { CustomEmoji } from "@emoji/models/custom-emoji.model";
import { InstanceEmojis } from "@emoji/models/instance-emojis.dto";

@Resolver(() => CustomEmoji)
export class EmojiResolver {
    public constructor(@Inject(EmojiService) private readonly emojiService: EmojiService) {}

    @Query(() => [InstanceEmojis])
    public async emojis(): Promise<InstanceEmojis[]> {
        return this.emojiService.getEmojis();
    }

    @Mutation(() => Boolean)
    public async invalidateEmojis(
        @Args("instanceUrls", { type: () => [String] }) instanceUrls: string[],
    ): Promise<boolean> {
        return this.emojiService.invalidateEmojis(instanceUrls);
    }
}
