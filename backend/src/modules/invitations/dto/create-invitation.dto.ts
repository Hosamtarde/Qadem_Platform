import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateInvitationDto {
  @IsUUID()
  jobId!: string;

  @IsUUID()
  candidateProfileId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  message?: string;
}