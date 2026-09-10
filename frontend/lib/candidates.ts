import { apiRequest, tokenStorage } from "./api";
import { CandidateProfile, UpdateCandidateProfileInput } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export function getMyProfile(): Promise<CandidateProfile> {
  return apiRequest<CandidateProfile>("/candidates/me");
}

export function updateMyProfile(
  data: UpdateCandidateProfileInput,
): Promise<CandidateProfile> {
  return apiRequest<CandidateProfile>("/candidates/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function uploadResume(file: File): Promise<CandidateProfile> {
  const form = new FormData();
  form.append("file", file);

  const token = tokenStorage.getAccess();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}/candidates/me/resume`, {
    method: "POST",
    headers,
    body: form,
  });

  const data = await response.json();

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : (data.message ?? "Upload failed");
    throw new Error(message);
  }

  return data as CandidateProfile;
}

export function removeResume(): Promise<CandidateProfile> {
  return apiRequest<CandidateProfile>("/candidates/me/resume", {
    method: "DELETE",
  });
}

export function resumeDownloadUrl(profileId: string): string {
  return `${API_URL}/candidates/${profileId}/resume`;
}

export async function downloadResume(
  profileId: string,
  fileName = "resume",
): Promise<void> {
  const token = tokenStorage.getAccess();
  const response = await fetch(resumeDownloadUrl(profileId), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error("Could not download the resume");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
