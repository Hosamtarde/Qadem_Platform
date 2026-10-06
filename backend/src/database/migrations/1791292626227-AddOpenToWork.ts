import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOpenToWork1791292626227 implements MigrationInterface {
    name = 'AddOpenToWork1791292626227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ADD "isOpenToWork" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ADD "openToWorkSince" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ALTER COLUMN "skills" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ALTER COLUMN "skills" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" DROP COLUMN "openToWorkSince"`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" DROP COLUMN "isOpenToWork"`);
    }

}
