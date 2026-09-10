import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class UpdateCandidateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  headline?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-\s()]{7,20}$/, {
    message: "Phone number format is not valid",
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  @ArrayMaxSize(30)
  skills?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  yearsOfExperience?: number;

  @IsOptional()
  @IsUrl({}, { message: "LinkedIn URL is not valid" })
  @MaxLength(255)
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: "GitHub URL is not valid" })
  @MaxLength(255)
  githubUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: "Portfolio URL is not valid" })
  @MaxLength(255)
  portfolioUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: "Resume URL is not valid" })
  @MaxLength(500)
  resumeUrl?: string;
}
