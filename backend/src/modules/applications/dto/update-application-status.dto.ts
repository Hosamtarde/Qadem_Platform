import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { ApplicationStatus } from "../../../common/enums";

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus, {
    message: "Status must be SUBMITTED, REVIEWING, ACCEPTED or REJECTED",
  })
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  companyNote?: string;
}
