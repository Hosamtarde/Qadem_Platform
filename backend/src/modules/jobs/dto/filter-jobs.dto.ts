import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { PaginationQueryDto } from "../../../common/dto/pagination.dto";
import { JobType } from "../../../common/enums";

export class FilterJobsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsEnum(JobType, {
    message: "Type must be FULL_TIME, PART_TIME or INTERNSHIP",
  })
  type?: JobType;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @IsOptional()
  @IsEnum(["newest", "oldest", "salary"], {
    message: "sortBy must be newest, oldest or salary",
  })
  sortBy?: "newest" | "oldest" | "salary" = "newest";
}
