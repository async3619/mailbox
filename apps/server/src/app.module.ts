import * as path from "path";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { EmojiModule } from "@emoji/emoji.module";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile:
                process.env.NODE_ENV === "production" ? true : path.join(process.cwd(), "..", "..", "schema.gql"),
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.MAILBOX_DB_HOST ?? "localhost",
            port: parseInt(process.env.MAILBOX_DB_PORT ?? "5002", 10),
            username: process.env.MAILBOX_DB_USER ?? "mailbox",
            password: process.env.MAILBOX_DB_PASSWORD ?? "mailbox",
            database: "mailbox",
            entities: [`${__dirname}/**/*.model{.ts,.js}`],
            migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
            autoLoadEntities: true,
            migrationsRun: true,
        }),
        EmojiModule,
    ],
})
export class AppModule {}
