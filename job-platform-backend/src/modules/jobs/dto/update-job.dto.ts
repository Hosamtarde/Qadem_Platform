import { PartialType } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateJobDto } from "./create-job.dto";

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
