import { apiRequest } from "./api";
import { Application, ApplicationStatus, StatusCounts } from "./types";

export function applyToJob(
  jobId: string,
  coverLetter?: string,
): Promise<Application> {
  return apiRequest<Application>(`/jobs/${jobId}/apply`, {
    method: "POST",
    body: JSON.stringify(coverLetter ? { coverLetter } : {}),
  });
}

export function listMyApplications(): Promise<Application[]> {
  return apiRequest<Application[]>("/applications/my");
}

export function myApplicationStats(): Promise<StatusCounts> {
  return apiRequest<StatusCounts>("/applications/my/stats");
}

export function hasApplied(jobId: string): Promise<{ applied: boolean }> {
  return apiRequest<{ applied: boolean }>(`/jobs/${jobId}/has-applied`);
}

export function listJobApplications(jobId: string): Promise<Application[]> {
  return apiRequest<Application[]>(`/jobs/${jobId}/applications`);
}

export function companyApplicationStats(): Promise<StatusCounts> {
  return apiRequest<StatusCounts>("/applications/company/stats");
}

export function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  companyNote?: string,
): Promise<Application> {
  return apiRequest<Application>(`/applications/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(companyNote ? { status, companyNote } : { status }),
  });
}
