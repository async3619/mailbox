import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Field, ObjectType, Int } from "@nestjs/graphql";

@Entity({ name: "custom-emojis" })
@ObjectType()
export class CustomEmoji extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    public instance!: string;

    @Field(() => String)
    @Column({ type: "varchar", length: 255 })
    public code!: string;

    @Field(() => String)
    @Column({ type: "text" })
    public url!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    public staticUrl!: string | null;
}
