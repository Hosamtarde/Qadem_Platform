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
import { FilterJobsDto } from "./dto/filter-jobs.dto";
import { PaginatedResult } from "../../common/dto/pagination.dto";

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

  async findAllActive(filters: FilterJobsDto): Promise<PaginatedResult<Job>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    const query = this.jobsRepository
      .createQueryBuilder("job")
      .leftJoinAndSelect("job.company", "company")
      .where("job.isActive = :isActive", { isActive: true });

    if (filters.search) {
      query.andWhere(
        "(job.title ILIKE :search OR job.description ILIKE :search)",
        { search: `%${filters.search}%` },
      );
    }

    if (filters.type) {
      query.andWhere("job.type = :type", { type: filters.type });
    }

    if (filters.location) {
      query.andWhere("job.location ILIKE :location", {
        location: `%${filters.location}%`,
      });
    }

    if (filters.salaryMin !== undefined) {
      query.andWhere("job.salaryMax >= :salaryMin", {
        salaryMin: filters.salaryMin,
      });
    }

    if (filters.salaryMax !== undefined) {
      query.andWhere("job.salaryMin <= :salaryMax", {
        salaryMax: filters.salaryMax,
      });
    }

    if (filters.sortBy === "oldest") {
      query.orderBy("job.createdAt", "ASC");
    } else if (filters.sortBy === "salary") {
      query.orderBy("job.salaryMax", "DESC", "NULLS LAST");
    } else {
      query.orderBy("job.createdAt", "DESC");
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return new PaginatedResult(data, total, page, limit);
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
