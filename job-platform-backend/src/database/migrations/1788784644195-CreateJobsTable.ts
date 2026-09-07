import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateJobsTable1788784644195 implements MigrationInterface {
    name = 'CreateJobsTable1788784644195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."jobs_type_enum" AS ENUM('FULL_TIME', 'PART_TIME', 'INTERNSHIP')`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "requirements" text, "type" "public"."jobs_type_enum" NOT NULL, "location" character varying NOT NULL, "salaryMin" integer, "salaryMax" integer, "isActive" boolean NOT NULL DEFAULT true, "companyId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3dc188bb49c6597addebf9a18" ON "jobs"  ("type") `);
        await queryRunner.query(`CREATE INDEX "IDX_f803a854cd07320ee634d8887f" ON "jobs"  ("location") `);
        await queryRunner.query(`CREATE INDEX "IDX_0438611f1bd3705dc884cfcc06" ON "jobs"  ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ce4483dc65ed9d2e171269d80" ON "jobs"  ("companyId") `);
        await queryRunner.query(`ALTER TABLE "jobs" ADD CONSTRAINT "FK_6ce4483dc65ed9d2e171269d801" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs" DROP CONSTRAINT "FK_6ce4483dc65ed9d2e171269d801"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ce4483dc65ed9d2e171269d80"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0438611f1bd3705dc884cfcc06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f803a854cd07320ee634d8887f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b3dc188bb49c6597addebf9a18"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`DROP TYPE "public"."jobs_type_enum"`);
    }

}
