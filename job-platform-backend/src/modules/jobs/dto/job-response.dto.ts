import { JobType } from "../../../common/enums";

export class JobCompanySummaryDto {
  id: string;
  name: string;
  location: string | null;
  logoUrl: string | null;
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
      this.company = {
        id: job.company.id,
        name: job.company.name,
        location: job.company.location,
        logoUrl: job.company.logoUrl,
      };
    }
  }
}
