import { apiRequest } from "./api";

export interface CandidateCard {
  id: string;
  fullName: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  yearsOfExperience: number | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  openToWorkSince: string | null;
}

export interface TalentSearchResult {
  items: CandidateCard[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TalentSearchParams {
  skills?: string[];
  location?: string;
  minYears?: number;
  q?: string;
  page?: number;
}

export function searchCandidates(
  params: TalentSearchParams = {},
): Promise<TalentSearchResult> {
  const query = new URLSearchParams();

  if (params.skills?.length) query.set("skills", params.skills.join(","));
  if (params.location) query.set("location", params.location);
  if (params.minYears != null) query.set("minYears", String(params.minYears));
  if (params.q) query.set("q", params.q);
  if (params.page && params.page > 1) query.set("page", String(params.page));

  const qs = query.toString();
  return apiRequest<TalentSearchResult>(
    `/candidates/search${qs ? `?${qs}` : ""}`,
  );
}