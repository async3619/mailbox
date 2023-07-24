import { DataSource } from "typeorm";
import { config } from "dotenv";
import * as path from "path";

config({
    path: path.join(process.cwd(), ".env.development"),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default new DataSource({
    type: "mysql",
    host: process.env.MAILBOX_DB_HOST ?? "localhost",
    port: parseInt(process.env.MAILBOX_DB_PORT ?? "5002", 10),
    username: process.env.MAILBOX_DB_USER ?? "mailbox",
    password: process.env.MAILBOX_DB_PASSWORD ?? "mailbox",
    database: "mailbox",
    entities: [`${__dirname}/**/*.model{.ts,.js}`],
    dropSchema: false,
    migrationsRun: true,
});
