import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CompaniesService } from "./companies.service";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CompanyResponseDto } from "./dto/company-response.dto";
import { CurrentUser, Public, Roles } from "../../common/decorators";
import { UserRole } from "../../common/enums";

@ApiTags("companies")
@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @ApiBearerAuth()
  @ApiOkResponse({ type: CompanyResponseDto })
  @Roles(UserRole.COMPANY)
  @Get("me")
  async getMyProfile(@CurrentUser("id") userId: string) {
    const company = await this.companiesService.findByUserId(userId);
    return new CompanyResponseDto(company);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: CompanyResponseDto })
  @Roles(UserRole.COMPANY)
  @Patch("me")
  async updateMyProfile(
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    const company = await this.companiesService.updateByUserId(userId, dto);
    return new CompanyResponseDto(company);
  }

  @Public()
  @ApiOkResponse({ type: CompanyResponseDto })
  @Get(":id")
  async getById(@Param("id", ParseUUIDPipe) id: string) {
    const company = await this.companiesService.findById(id);
    return new CompanyResponseDto(company);
  }
}
