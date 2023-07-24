import { Field, ObjectType } from "@nestjs/graphql";
import { CustomEmoji } from "@emoji/models/custom-emoji.model";

@ObjectType()
export class InstanceEmojis {
    @Field(() => String)
    public instance!: string;

    @Field(() => [CustomEmoji])
    public emojis!: CustomEmoji[];
}
