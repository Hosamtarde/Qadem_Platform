import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";
import { Company } from "./entities/company.entity";
import { ResponseStatsService } from "./response-stats.service";
import { ResponseStatsTask } from "./response-stats.task";

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [CompaniesController],
  providers: [CompaniesService,ResponseStatsService,ResponseStatsTask ],
  exports: [CompaniesService, ResponseStatsService],
})
export class CompaniesModule {}
