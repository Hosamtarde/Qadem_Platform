import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCandidateProfilesTable1789008996078 implements MigrationInterface {
    name = 'CreateCandidateProfilesTable1789008996078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "candidate_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "headline" character varying, "bio" text, "phone" character varying, "location" character varying, "skills" text array NOT NULL DEFAULT ARRAY[]::text[], "yearsOfExperience" integer, "linkedinUrl" character varying, "githubUrl" character varying, "portfolioUrl" character varying, "resumeUrl" character varying, "resumeFileName" character varying, "resumeOriginalName" character varying, "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_df5454fe06a1630d3ba903a95d" UNIQUE ("userId"), CONSTRAINT "PK_8e8cf5b54118601673585218cc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "candidate_profiles" ADD CONSTRAINT "FK_df5454fe06a1630d3ba903a95d8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "candidate_profiles" DROP CONSTRAINT "FK_df5454fe06a1630d3ba903a95d8"`);
        await queryRunner.query(`DROP TABLE "candidate_profiles"`);
    }

}
