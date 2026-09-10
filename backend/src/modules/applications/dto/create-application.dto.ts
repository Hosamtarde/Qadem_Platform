import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateApplicationDto {
  @IsOptional()
  @IsString()
  @MinLength(20, {
    message: "A cover letter should be at least 20 characters",
  })
  @MaxLength(3000)
  coverLetter?: string;
}
