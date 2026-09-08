import { apiRequest } from "./api";
import { Job, JobType } from "./types";

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

export function listJobs(): Promise<Job[]> {
  return apiRequest<Job[]>("/jobs", { auth: false });
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
