import { apiRequest } from "./api";
import { Job, JobFilters, JobType, Paginated } from "./types";

export interface CreateJobInput {
  title: string;
  description: string;
  requirements?: string;
  type: JobType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface UpdateJobInput extends Partial<CreateJobInput> {
  isActive?: boolean;
}

export function buildJobQuery(filters: JobFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.type) params.set("type", filters.type);
  if (filters.location) params.set("location", filters.location);
  if (filters.salaryMin != null) params.set("salaryMin", String(filters.salaryMin));
  if (filters.salaryMax != null) params.set("salaryMax", String(filters.salaryMax));
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  return params.toString();
}

export function listJobs(filters: JobFilters = {}): Promise<Paginated<Job>> {
  const query = buildJobQuery(filters);
  const path = query ? `/jobs?${query}` : "/jobs";
  return apiRequest<Paginated<Job>>(path, { auth: false });
}

export function getJob(id: string): Promise<Job> {
  return apiRequest<Job>(`/jobs/${id}`, { auth: false });
}

export function listMyJobs(): Promise<Job[]> {
  return apiRequest<Job[]>("/jobs/my-jobs");
}

export function createJob(data: CreateJobInput): Promise<Job> {
  return apiRequest<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateJob(id: string, data: UpdateJobInput): Promise<Job> {
  return apiRequest<Job>(`/jobs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteJob(id: string): Promise<void> {
  return apiRequest<void>(`/jobs/${id}`, { method: "DELETE" });
}
