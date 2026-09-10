export type UserRole = "CANDIDATE" | "COMPANY";
export type JobType = "FULL_TIME" | "PART_TIME" | "INTERNSHIP";
export type ApplicationStatus =
  | "SUBMITTED"
  | "REVIEWING"
  | "ACCEPTED"
  | "REJECTED";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  location: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySummary {
  id: string;
  name: string;
  location: string | null;
  logoUrl: string | null;
}

export interface Job {
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
  company?: CompanySummary;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERNSHIP: "Internship",
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface JobFilters {
  search?: string;
  type?: JobType;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  sortBy?: "newest" | "oldest" | "salary";
  page?: number;
  limit?: number;
}

export interface ApplicationJobSummary {
  id: string;
  title: string;
  type: JobType;
  location: string;
  companyName: string | null;
}

export interface ApplicationCandidateSummary {
  id: string;
  fullName: string;
  email: string;
  profileId: string | null;
  headline: string | null;
  location: string | null;
  skills: string[];
  yearsOfExperience: number | null;
  phone: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  hasResumeFile: boolean;
}

export interface Application {
  id: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  companyNote: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  job?: ApplicationJobSummary;
  candidate?: ApplicationCandidateSummary;
}

export type StatusCounts = Record<ApplicationStatus, number>;

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SUBMITTED: "Submitted",
  REVIEWING: "Reviewing",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export const STATUS_BADGES: Record<ApplicationStatus, string> = {
  SUBMITTED: "badge-neutral",
  REVIEWING: "badge-warn",
  ACCEPTED: "badge-success",
  REJECTED: "badge-danger",
};

export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  headline: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  skills: string[];
  yearsOfExperience: number | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  resumeOriginalName: string | null;
  hasResumeFile: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCandidateProfileInput {
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  yearsOfExperience?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
}