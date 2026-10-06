const MIN_SAMPLE = 10;

export interface CompanyResponseOptions {
  includeUnpublished?: boolean;
}

export class CompanyResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
  website!: string | null;
  location!: string | null;
  logoUrl!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
  responseRate!: number | null;
  avgResponseDays!: number | null;
  responseSampleSize!: number;
  responseIsPublic!: boolean;

  constructor(
    company: {
      id: string;
      name: string;
      description: string | null;
      website: string | null;
      location: string | null;
      logoUrl: string | null;
      createdAt: Date;
      updatedAt: Date;
      responseRate?: string | number | null;
      avgResponseDays?: string | number | null;
      responseSampleSize?: number | null;
    },
    options: CompanyResponseOptions = {},
  ) {
    this.id = company.id;
    this.name = company.name;
    this.description = company.description;
    this.website = company.website;
    this.location = company.location;
    this.logoUrl = company.logoUrl;
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;

    const sample = company.responseSampleSize ?? 0;
    const visible = options.includeUnpublished === true || sample >= MIN_SAMPLE;

    this.responseSampleSize = sample;
    this.responseIsPublic = sample >= MIN_SAMPLE;
    this.responseRate =
      visible && company.responseRate != null
        ? Math.round(Number(company.responseRate))
        : null;
    this.avgResponseDays =
      visible && company.avgResponseDays != null
        ? Math.round(Number(company.avgResponseDays) * 10) / 10
        : null;
  }
}