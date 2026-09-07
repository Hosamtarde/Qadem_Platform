import { apiRequest } from "./api";
import { Company } from "./types";

export interface UpdateCompanyInput {
  name?: string;
  description?: string;
  website?: string;
  location?: string;
  logoUrl?: string;
}

export function getMyCompany(): Promise<Company> {
  return apiRequest<Company>("/companies/me");
}

export function updateMyCompany(data: UpdateCompanyInput): Promise<Company> {
  return apiRequest<Company>("/companies/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getCompanyById(id: string): Promise<Company> {
  return apiRequest<Company>(`/companies/${id}`, { auth: false });
}
