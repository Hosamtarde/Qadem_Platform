import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResponseStats1791318111985 implements MigrationInterface {
    name = 'AddResponseStats1791318111985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "companies" ADD "responseRate" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "avgResponseDays" numeric(6,2)`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "responseSampleSize" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "companies" ADD "responseStatsAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ALTER COLUMN "skills" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ALTER COLUMN "skills" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "responseStatsAt"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "responseSampleSize"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "avgResponseDays"`);
        await queryRunner.query(`ALTER TABLE "companies" DROP COLUMN "responseRate"`);
    }

}
