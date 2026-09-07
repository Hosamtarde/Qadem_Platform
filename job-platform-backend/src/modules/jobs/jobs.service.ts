import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job } from "./entities/job.entity";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { CompaniesService } from "../companies/companies.service";

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(userId: string, dto: CreateJobDto): Promise<Job> {
    const company = await this.companiesService.findByUserId(userId);

    this.assertSalaryRange(dto.salaryMin, dto.salaryMax);

    const job = this.jobsRepository.create({
      ...dto,
      companyId: company.id,
    });

    return this.jobsRepository.save(job);
  }

  async findAllActive(): Promise<Job[]> {
    return this.jobsRepository.find({
      where: { isActive: true },
      relations: { company: true },
      order: { createdAt: "DESC" },
    });
  }

  async findByCompanyUserId(userId: string): Promise<Job[]> {
    const company = await this.companiesService.findByUserId(userId);

    return this.jobsRepository.find({
      where: { companyId: company.id },
      order: { createdAt: "DESC" },
    });
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: { company: true },
    });

    if (!job) {
      throw new NotFoundException("Job not found");
    }

    return job;
  }

  async update(userId: string, id: string, dto: UpdateJobDto): Promise<Job> {
    const job = await this.findOwnedJob(userId, id);

    const salaryMin = dto.salaryMin ?? job.salaryMin;
    const salaryMax = dto.salaryMax ?? job.salaryMax;
    this.assertSalaryRange(salaryMin, salaryMax);

    Object.assign(job, dto);
    return this.jobsRepository.save(job);
  }

  async remove(userId: string, id: string): Promise<void> {
    const job = await this.findOwnedJob(userId, id);
    await this.jobsRepository.remove(job);
  }

  private async findOwnedJob(userId: string, id: string): Promise<Job> {
    const job = await this.findById(id);
    const company = await this.companiesService.findByUserId(userId);

    if (job.companyId !== company.id) {
      throw new ForbiddenException(
        "You can only manage your own job postings",
      );
    }

    return job;
  }

  private assertSalaryRange(
    min: number | null | undefined,
    max: number | null | undefined,
  ): void {
    if (min != null && max != null && min > max) {
      throw new ForbiddenException(
        "Minimum salary cannot be greater than maximum salary",
      );
    }
  }
}
