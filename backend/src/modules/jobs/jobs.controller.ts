import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { JobResponseDto } from "./dto/job-response.dto";
import { CurrentUser, Public, Roles } from "../../common/decorators";
import { UserRole } from "../../common/enums";
import { FilterJobsDto } from "./dto/filter-jobs.dto";

@ApiTags("jobs")
@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: JobResponseDto })
  @Roles(UserRole.COMPANY)
  @Post()
  async create(@CurrentUser("id") userId: string, @Body() dto: CreateJobDto) {
    const job = await this.jobsService.create(userId, dto);
    return new JobResponseDto(job);
  }

  @Public()
  @Get()
  async findAll(@Query() filters: FilterJobsDto) {
    const result = await this.jobsService.findAllActive(filters);
    return {
      data: result.data.map((job) => new JobResponseDto(job)),
      meta: result.meta,
    };
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: [JobResponseDto] })
  @Roles(UserRole.COMPANY)
  @Get("my-jobs")
  async findMyJobs(@CurrentUser("id") userId: string) {
    const jobs = await this.jobsService.findByCompanyUserId(userId);
    return jobs.map((job) => new JobResponseDto(job));
  }

  @Public()
  @ApiOkResponse({ type: JobResponseDto })
  @Get(":id")
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const job = await this.jobsService.findById(id);
    return new JobResponseDto(job);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: JobResponseDto })
  @Roles(UserRole.COMPANY)
  @Patch(":id")
  async update(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateJobDto,
  ) {
    const job = await this.jobsService.update(userId, id, dto);
    return new JobResponseDto(job);
  }

  @ApiBearerAuth()
  @Roles(UserRole.COMPANY)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async remove(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    await this.jobsService.remove(userId, id);
  }
}
