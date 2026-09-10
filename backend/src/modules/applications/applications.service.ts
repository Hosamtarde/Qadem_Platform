import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QueryFailedError, Repository } from "typeorm";
import { Application } from "./entities/application.entity";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationStatusDto } from "./dto/update-application-status.dto";
import { JobsService } from "../jobs/jobs.service";
import { CompaniesService } from "../companies/companies.service";
import { CandidatesService } from "../candidates/candidates.service";
import { ApplicationStatus } from "../../common/enums";

const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.SUBMITTED]: [
    ApplicationStatus.REVIEWING,
    ApplicationStatus.ACCEPTED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.REVIEWING]: [
    ApplicationStatus.ACCEPTED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.ACCEPTED]: [],
  [ApplicationStatus.REJECTED]: [],
};

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private readonly jobsService: JobsService,
    private readonly companiesService: CompaniesService,
    private readonly candidatesService: CandidatesService,
  ) {}

  async apply(
    candidateId: string,
    jobId: string,
    dto: CreateApplicationDto,
  ): Promise<Application> {
    const job = await this.jobsService.findById(jobId);

    if (!job.isActive) {
      throw new BadRequestException(
        "This opening is no longer accepting applications",
      );
    }

    const profile = await this.candidatesService
      .findByUserId(candidateId)
      .catch(() => null);

    if (!profile || (!profile.resumeFileName && !profile.resumeUrl)) {
      throw new BadRequestException(
        "Add a resume to your profile before applying",
      );
    }

    const existing = await this.applicationsRepository.findOne({
      where: { jobId, candidateId },
    });

    if (existing) {
      throw new ConflictException("You have already applied to this opening");
    }

    const application = this.applicationsRepository.create({
      jobId,
      candidateId,
      coverLetter: dto.coverLetter ?? null,
      status: ApplicationStatus.SUBMITTED,
    });

    try {
      return await this.applicationsRepository.save(application);
    } catch (err) {
      if (err instanceof QueryFailedError && this.isUniqueViolation(err)) {
        throw new ConflictException("You have already applied to this opening");
      }
      throw err;
    }
  }

  async findMine(candidateId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { candidateId },
      relations: { job: { company: true } },
      order: { createdAt: "DESC" },
    });
  }

  async findOneForCandidate(
    candidateId: string,
    id: string,
  ): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: { job: { company: true } },
    });

    if (!application) {
      throw new NotFoundException("Application not found");
    }

    if (application.candidateId !== candidateId) {
      throw new ForbiddenException("You can only view your own applications");
    }

    return application;
  }

  async hasApplied(candidateId: string, jobId: string): Promise<boolean> {
    const count = await this.applicationsRepository.count({
      where: { candidateId, jobId },
    });
    return count > 0;
  }

  async findForJob(userId: string, jobId: string) {
    await this.assertJobOwnership(userId, jobId);

    const applications = await this.applicationsRepository.find({
      where: { jobId },
      relations: { candidate: true },
      order: { createdAt: "DESC" },
    });

    return Promise.all(
      applications.map(async (application) => {
        const profile = await this.candidatesService
          .findByUserId(application.candidateId)
          .catch(() => null);
        return Object.assign(application, { candidateProfile: profile });
      }),
    );
  }

  async updateStatus(
    userId: string,
    id: string,
    dto: UpdateApplicationStatusDto,
  ) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: { candidate: true },
    });

    if (!application) {
      throw new NotFoundException("Application not found");
    }

    await this.assertJobOwnership(userId, application.jobId);

    if (dto.status !== application.status) {
      const allowed = ALLOWED_TRANSITIONS[application.status];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException(
          `An application marked ${application.status} cannot move to ${dto.status}`,
        );
      }
      application.status = dto.status;

      if (!application.respondedAt) {
        application.respondedAt = new Date();
      }
    }

    if (dto.companyNote !== undefined) {
      application.companyNote = dto.companyNote;
    }

    const saved = await this.applicationsRepository.save(application);
    const profile = await this.candidatesService
      .findByUserId(saved.candidateId)
      .catch(() => null);
    return Object.assign(saved, { candidateProfile: profile });
  }

  async countByStatusForCompany(
    userId: string,
  ): Promise<Record<string, number>> {
    const company = await this.companiesService.findByUserId(userId);

    const rows = await this.applicationsRepository
      .createQueryBuilder("application")
      .innerJoin("application.job", "job")
      .select("application.status", "status")
      .addSelect("COUNT(application.id)", "count")
      .where("job.companyId = :companyId", { companyId: company.id })
      .groupBy("application.status")
      .getRawMany<{ status: string; count: string }>();

    return this.toCounts(rows);
  }

  async countByStatusForCandidate(
    candidateId: string,
  ): Promise<Record<string, number>> {
    const rows = await this.applicationsRepository
      .createQueryBuilder("application")
      .select("application.status", "status")
      .addSelect("COUNT(application.id)", "count")
      .where("application.candidateId = :candidateId", { candidateId })
      .groupBy("application.status")
      .getRawMany<{ status: string; count: string }>();

    return this.toCounts(rows);
  }

  private toCounts(
    rows: { status: string; count: string }[],
  ): Record<string, number> {
    const result: Record<string, number> = {
      SUBMITTED: 0,
      REVIEWING: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    };

    rows.forEach((row) => {
      result[row.status] = Number(row.count);
    });

    return result;
  }

  private async assertJobOwnership(
    userId: string,
    jobId: string,
  ): Promise<void> {
    const job = await this.jobsService.findById(jobId);
    const company = await this.companiesService.findByUserId(userId);

    if (job.companyId !== company.id) {
      throw new ForbiddenException(
        "You can only manage applications for your own postings",
      );
    }
  }

  private isUniqueViolation(err: QueryFailedError): boolean {
    const code = (err as unknown as { code?: string }).code;
    return code === "23505";
  }
}
