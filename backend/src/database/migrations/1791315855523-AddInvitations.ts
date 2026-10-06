import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInvitations1791315855523 implements MigrationInterface {
    name = 'AddInvitations1791315855523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invitations_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jobId" uuid NOT NULL, "companyId" uuid NOT NULL, "candidateId" uuid NOT NULL, "message" text, "status" "public"."invitations_status_enum" NOT NULL DEFAULT 'PENDING', "declineReason" text, "expiresAt" TIMESTAMP NOT NULL, "respondedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_invitation_job_candidate" UNIQUE ("jobId", "candidateId"), CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_49951fcfd1f7d0b5a5c2e4b07b" ON "invitations" ("jobId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6c23a94f8c31d43ad25bcb292" ON "invitations" ("companyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_invitation_candidate_inbox" ON "invitations" ("candidateId", "status", "createdAt") `);
        await queryRunner.query(`ALTER TYPE "public"."notifications_type_enum" RENAME TO "notifications_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('APPLICATION_STATUS_CHANGED', 'NEW_APPLICATION', 'INVITATION_RECEIVED', 'INVITATION_ANSWERED')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notifications_type_enum" USING "type"::"text"::"public"."notifications_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ALTER COLUMN "skills" SET DEFAULT ARRAY[]::text[]`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_49951fcfd1f7d0b5a5c2e4b07b7" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_c6c23a94f8c31d43ad25bcb2920" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_9a7726fb24d1c93f041aee1fe52" FOREIGN KEY ("candidateId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_9a7726fb24d1c93f041aee1fe52"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_c6c23a94f8c31d43ad25bcb2920"`);
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_49951fcfd1f7d0b5a5c2e4b07b7"`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ALTER COLUMN "skills" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum_old" AS ENUM('APPLICATION_STATUS_CHANGED', 'NEW_APPLICATION')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notifications_type_enum_old" USING "type"::"text"::"public"."notifications_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notifications_type_enum_old" RENAME TO "notifications_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_invitation_candidate_inbox"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6c23a94f8c31d43ad25bcb292"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_49951fcfd1f7d0b5a5c2e4b07b"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
        await queryRunner.query(`DROP TYPE "public"."invitations_status_enum"`);
    }

}
