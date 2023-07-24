import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomEmojiTable1689696239377 implements MigrationInterface {
    name = "CreateCustomEmojiTable1689696239377";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`custom-emojis\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`url\` text NOT NULL, \`staticUrl\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`custom-emojis\``);
    }
}
