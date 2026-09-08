export class CompanyResponseDto {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  location: string | null;
  logoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(company: {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    location: string | null;
    logoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = company.id;
    this.name = company.name;
    this.description = company.description;
    this.website = company.website;
    this.location = company.location;
    this.logoUrl = company.logoUrl;
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
  }
}
