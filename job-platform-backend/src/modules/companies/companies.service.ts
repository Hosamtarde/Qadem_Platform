import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "./entities/company.entity";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async createForUser(userId: string, name: string): Promise<Company> {
    const company = this.companiesRepository.create({ userId, name });
    return this.companiesRepository.save(company);
  }

  async findByUserId(userId: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { userId },
    });

    if (!company) {
      throw new NotFoundException("Company profile not found");
    }

    return company;
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException("Company not found");
    }

    return company;
  }

  async updateByUserId(
    userId: string,
    dto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.findByUserId(userId);
    Object.assign(company, dto);
    return this.companiesRepository.save(company);
  }
}
