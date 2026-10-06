import { apiRequest } from "./api";

export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED";

export interface Invitation {
  id: string;
  status: InvitationStatus;
  message: string | null;
  declineReason: string | null;
  expiresAt: string;
  respondedAt: string | null;
  createdAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    type: string;
    salaryMin: number | null;
    salaryMax: number | null;
  } | null;
  company: {
    id: string;
    name: string;
    location: string | null;
  } | null;
  candidate: {
    id: string;
    fullName: string;
  } | null;
}

export function inviteCandidate(data: {
  jobId: string;
  candidateProfileId: string;
  message?: string;
}): Promise<Invitation> {
  return apiRequest<Invitation>("/invitations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listMyInvitations(): Promise<Invitation[]> {
  return apiRequest<Invitation[]>("/invitations/my");
}

export function listSentInvitations(): Promise<Invitation[]> {
  return apiRequest<Invitation[]>("/invitations/sent");
}

export function respondToInvitation(
  id: string,
  status: "ACCEPTED" | "DECLINED",
  declineReason?: string,
): Promise<Invitation> {
  return apiRequest<Invitation>(`/invitations/${id}/respond`, {
    method: "PATCH",
    body: JSON.stringify({ status, declineReason }),
  });
}