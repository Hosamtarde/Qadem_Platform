import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationsService } from "./applications.service";
import { ApplicationsController } from "./applications.controller";
import { Application } from "./entities/application.entity";
import { JobsModule } from "../jobs/jobs.module";
import { CompaniesModule } from "../companies/companies.module";
import { CandidatesModule } from "../candidates/candidates.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    JobsModule,
    CompaniesModule,
    CandidatesModule,
    
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
