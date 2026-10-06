import { Transform } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class SearchCandidatesDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === "string"
      ? value.split(",").map((s) => s.trim()).filter(Boolean)
      : value,
  )
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  skills?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @Transform(({ value }) => (value === "" ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  @Max(60)
  minYears?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  q?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number;
}