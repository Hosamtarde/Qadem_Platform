import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { CandidatesService } from "./candidates.service";
import { UpdateCandidateProfileDto } from "./dto/update-candidate-profile.dto";
import { CandidateProfileResponseDto } from "./dto/candidate-profile-response.dto";
import { resumeUploadOptions } from "./resume-upload.config";
import { CurrentUser, Roles } from "../../common/decorators";
import { UserRole } from "../../common/enums";

@ApiTags("candidates")
@ApiBearerAuth()
@Controller("candidates")
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Roles(UserRole.CANDIDATE)
  @Get("me")
  async getMyProfile(@CurrentUser("id") userId: string) {
    const profile = await this.candidatesService.findByUserId(userId);
    return new CandidateProfileResponseDto(profile);
  }

  @Roles(UserRole.CANDIDATE)
  @Patch("me")
  async updateMyProfile(
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateCandidateProfileDto,
  ) {
    const profile = await this.candidatesService.updateByUserId(userId, dto);
    return new CandidateProfileResponseDto(profile);
  }

  @Roles(UserRole.CANDIDATE)
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file", resumeUploadOptions))
  @Post("me/resume")
  async uploadResume(
    @CurrentUser("id") userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new ForbiddenException("No file was uploaded");
    }
    const profile = await this.candidatesService.attachResume(userId, file);
    return new CandidateProfileResponseDto(profile);
  }

  @Roles(UserRole.CANDIDATE)
  @Delete("me/resume")
  async removeResume(@CurrentUser("id") userId: string) {
    const profile = await this.candidatesService.removeResume(userId);
    return new CandidateProfileResponseDto(profile);
  }

  @Roles(UserRole.CANDIDATE, UserRole.COMPANY)
  @Get(":id/resume")
  async downloadResume(
    @CurrentUser("id") userId: string,
    @CurrentUser("role") role: UserRole,
    @Param("id", ParseUUIDPipe) id: string,
    @Res() res: Response,
  ) {
    const profile = await this.candidatesService.findById(id);

    if (role === UserRole.CANDIDATE && profile.userId !== userId) {
      throw new ForbiddenException("You can only download your own resume");
    }

    const { path, originalName } =
      await this.candidatesService.getResumePath(id);

    return res.download(path, originalName);
  }
}
