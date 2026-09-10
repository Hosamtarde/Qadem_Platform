import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApplicationsTable1788992978409 implements MigrationInterface {
    name = 'CreateApplicationsTable1788992978409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."applications_status_enum" AS ENUM('SUBMITTED', 'REVIEWING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coverLetter" text, "status" "public"."applications_status_enum" NOT NULL DEFAULT 'SUBMITTED', "jobId" uuid NOT NULL, "candidateId" uuid NOT NULL, "companyNote" text, "respondedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_application_job_candidate" UNIQUE ("jobId", "candidateId"), CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ee114cee92e995a9e75c05cfb" ON "applications"  ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_f6ebb8bc5061068e4dd97df3c7" ON "applications"  ("jobId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a34254e3f2b3d20f07f8dbd632" ON "applications"  ("candidateId") `);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_f6ebb8bc5061068e4dd97df3c77" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_a34254e3f2b3d20f07f8dbd6322" FOREIGN KEY ("candidateId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_a34254e3f2b3d20f07f8dbd6322"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_f6ebb8bc5061068e4dd97df3c77"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a34254e3f2b3d20f07f8dbd632"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f6ebb8bc5061068e4dd97df3c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ee114cee92e995a9e75c05cfb"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TYPE "public"."applications_status_enum"`);
    }

}
