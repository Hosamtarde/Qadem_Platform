import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationStatusDto } from "./dto/update-application-status.dto";
import { ApplicationResponseDto } from "./dto/application-response.dto";
import { CurrentUser, Roles } from "../../common/decorators";
import { UserRole } from "../../common/enums";

@ApiTags("applications")
@ApiBearerAuth()
@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Roles(UserRole.CANDIDATE)
  @Post("jobs/:id/apply")
  async apply(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) jobId: string,
    @Body() dto: CreateApplicationDto,
  ) {
    const application = await this.applicationsService.apply(
      userId,
      jobId,
      dto,
    );
    return new ApplicationResponseDto(application);
  }

  @Roles(UserRole.CANDIDATE)
  @Get("jobs/:id/has-applied")
  async hasApplied(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) jobId: string,
  ) {
    const applied = await this.applicationsService.hasApplied(userId, jobId);
    return { applied };
  }

  @Roles(UserRole.COMPANY)
  @Get("jobs/:id/applications")
  async findForJob(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) jobId: string,
  ) {
    const applications = await this.applicationsService.findForJob(
      userId,
      jobId,
    );
    return applications.map((a) => new ApplicationResponseDto(a));
  }

  @Roles(UserRole.CANDIDATE)
  @Get("applications/my/stats")
  async myStats(@CurrentUser("id") userId: string) {
    return this.applicationsService.countByStatusForCandidate(userId);
  }

  @Roles(UserRole.COMPANY)
  @Get("applications/company/stats")
  async companyStats(@CurrentUser("id") userId: string) {
    return this.applicationsService.countByStatusForCompany(userId);
  }

  @Roles(UserRole.CANDIDATE)
  @Get("applications/my")
  async findMine(@CurrentUser("id") userId: string) {
    const applications = await this.applicationsService.findMine(userId);
    return applications.map((a) => new ApplicationResponseDto(a));
  }

  @Roles(UserRole.COMPANY)
  @Patch("applications/:id/status")
  async updateStatus(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    const application = await this.applicationsService.updateStatus(
      userId,
      id,
      dto,
    );
    return new ApplicationResponseDto(application);
  }

  @Roles(UserRole.CANDIDATE)
  @Get("applications/:id")
  async findOne(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    const application = await this.applicationsService.findOneForCandidate(
      userId,
      id,
    );
    return new ApplicationResponseDto(application);
  }
}
