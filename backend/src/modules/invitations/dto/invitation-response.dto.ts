import { Invitation } from "../entities/invitation.entity";
import { InvitationStatus } from "../../../common/enums";

export class InvitationResponseDto {
  id: string;
  status: InvitationStatus;
  message: string | null;
  declineReason: string | null;
  expiresAt: Date;
  respondedAt: Date | null;
  createdAt: Date;

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

  constructor(invitation: Invitation) {
    this.id = invitation.id;
    this.status = invitation.status;
    this.message = invitation.message;
    this.declineReason = invitation.declineReason;
    this.expiresAt = invitation.expiresAt;
    this.respondedAt = invitation.respondedAt;
    this.createdAt = invitation.createdAt;

    this.job = invitation.job
      ? {
          id: invitation.job.id,
          title: invitation.job.title,
          location: invitation.job.location,
          type: invitation.job.type,
          salaryMin: invitation.job.salaryMin ?? null,
          salaryMax: invitation.job.salaryMax ?? null,
        }
      : null;

    this.company = invitation.company
      ? {
          id: invitation.company.id,
          name: invitation.company.name,
          location: invitation.company.location ?? null,
        }
      : null;

    this.candidate = invitation.candidate
      ? {
          id: invitation.candidate.id,
          fullName: invitation.candidate.fullName,
        }
      : null;
  }
}