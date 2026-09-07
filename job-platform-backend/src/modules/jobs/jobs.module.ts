import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobsService } from "./jobs.service";
import { JobsController } from "./jobs.controller";
import { Job } from "./entities/job.entity";
import { CompaniesModule } from "../companies/companies.module";

@Module({
  imports: [TypeOrmModule.forFeature([Job]), CompaniesModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
