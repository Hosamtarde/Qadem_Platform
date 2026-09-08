import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { JobType } from "../../../common/enums";

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(5000)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  requirements?: string;

  @IsEnum(JobType, {
    message: "Type must be FULL_TIME, PART_TIME or INTERNSHIP",
  })
  type: JobType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  location: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;
}
