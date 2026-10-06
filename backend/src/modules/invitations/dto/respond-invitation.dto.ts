import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { InvitationStatus } from "../../../common/enums";

export class RespondInvitationDto {
  @IsEnum([InvitationStatus.ACCEPTED, InvitationStatus.DECLINED], {
    message: "Status must be ACCEPTED or DECLINED",
  })
  status!: InvitationStatus.ACCEPTED | InvitationStatus.DECLINED;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  declineReason?: string;
}