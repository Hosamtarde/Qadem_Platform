import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailVerification1789647249563 implements MigrationInterface {
    name = 'AddEmailVerification1789647249563'

     public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_verification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenHash" character varying NOT NULL, "userId" uuid NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "usedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_417a095bbed21c2369a6a01ab9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_90489f8f3368c45f461e90efbe" ON "email_verification_tokens" ("tokenHash") `);
        await queryRunner.query(`ALTER TABLE "users" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`UPDATE "users" SET "isEmailVerified" = true`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ALTER COLUMN "skills" SET DEFAULT ARRAY[]::text[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ALTER COLUMN "skills" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isEmailVerified"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90489f8f3368c45f461e90efbe"`);
        await queryRunner.query(`DROP TABLE "email_verification_tokens"`);
    }

}
