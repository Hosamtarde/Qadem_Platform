import { JobType } from "../../../common/enums";

const MIN_SAMPLE = 10;

export class JobCompanySummaryDto {
  id: string;
  name: string;
  location: string | null;
  logoUrl: string | null;
  responseRate: number | null;
  avgResponseDays: number | null;
  responseSampleSize: number;
}

export class JobResponseDto {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  type: JobType;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  isActive: boolean;
  companyId: string;
  company?: JobCompanySummaryDto;
  createdAt: Date;
  updatedAt: Date;

  constructor(job: {
    id: string;
    title: string;
    description: string;
    requirements: string | null;
    type: JobType;
    location: string;
    salaryMin: number | null;
    salaryMax: number | null;
    isActive: boolean;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    company?: {
      id: string;
      name: string;
      location: string | null;
      logoUrl: string | null;
      responseRate?: string | null;
      avgResponseDays?: string | null;
      responseSampleSize?: number;
    };
  }) {
    this.id = job.id;
    this.title = job.title;
    this.description = job.description;
    this.requirements = job.requirements;
    this.type = job.type;
    this.location = job.location;
    this.salaryMin = job.salaryMin;
    this.salaryMax = job.salaryMax;
    this.isActive = job.isActive;
    this.companyId = job.companyId;
    this.createdAt = job.createdAt;
    this.updatedAt = job.updatedAt;

    if (job.company) {
      const sample = job.company.responseSampleSize ?? 0;

      const enough = sample >= MIN_SAMPLE;

      this.company = {
        id: job.company.id,
        name: job.company.name,
        location: job.company.location,
        logoUrl: job.company.logoUrl,
        responseRate:
          enough && job.company.responseRate != null
            ? Math.round(Number(job.company.responseRate))
            : null,
        avgResponseDays:
          enough && job.company.avgResponseDays != null
            ? Math.round(Number(job.company.avgResponseDays) * 10) / 10
            : null,
        responseSampleSize: sample,
      };
    }
  }
}