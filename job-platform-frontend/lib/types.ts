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
