import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvitationsService } from "./invitations.service";
import { InvitationsController } from "./invitations.controller";
import { Invitation } from "./entities/invitation.entity";
import { JobsModule } from "../jobs/jobs.module";
import { CompaniesModule } from "../companies/companies.module";
import { CandidatesModule } from "../candidates/candidates.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation]),
    JobsModule,
    CompaniesModule,
    CandidatesModule,
    NotificationsModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}