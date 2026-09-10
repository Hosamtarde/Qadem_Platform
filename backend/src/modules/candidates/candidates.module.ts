import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CandidatesService } from "./candidates.service";
import { CandidatesController } from "./candidates.controller";
import { CandidateProfile } from "./entities/candidate-profile.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CandidateProfile])],
  controllers: [CandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
