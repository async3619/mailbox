import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomEmojiInstanceColumn1689696676382 implements MigrationInterface {
    name = "AddCustomEmojiInstanceColumn1689696676382";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`custom-emojis\` ADD \`instance\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`custom-emojis\` DROP COLUMN \`instance\``);
    }
}
