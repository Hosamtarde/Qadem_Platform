import { ApplicationStatus, JobType } from "../../../common/enums";

export class ApplicationJobSummaryDto {
  id: string;
  title: string;
  type: JobType;
  location: string;
  companyName: string | null;
}

export class ApplicationCandidateSummaryDto {
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

export class ApplicationResponseDto {
  id: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  companyNote: string | null;
  respondedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  job?: ApplicationJobSummaryDto;
  candidate?: ApplicationCandidateSummaryDto;

  constructor(application: {
    id: string;
    coverLetter: string | null;
    status: ApplicationStatus;
    companyNote: string | null;
    respondedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    job?: {
      id: string;
      title: string;
      type: JobType;
      location: string;
      company?: { name: string };
    };
    candidate?: {
      id: string;
      fullName: string;
      email: string;
    };
    candidateProfile?: {
      id: string;
      headline: string | null;
      location: string | null;
      skills: string[];
      yearsOfExperience: number | null;
      phone: string | null;
      linkedinUrl: string | null;
      githubUrl: string | null;
      portfolioUrl: string | null;
      resumeUrl: string | null;
      resumeFileName: string | null;
    } | null;
  }) {
    this.id = application.id;
    this.coverLetter = application.coverLetter;
    this.status = application.status;
    this.companyNote = application.companyNote;
    this.respondedAt = application.respondedAt;
    this.createdAt = application.createdAt;
    this.updatedAt = application.updatedAt;

    if (application.job) {
      this.job = {
        id: application.job.id,
        title: application.job.title,
        type: application.job.type,
        location: application.job.location,
        companyName: application.job.company?.name ?? null,
      };
    }

    if (application.candidate) {
      const p = application.candidateProfile;
      this.candidate = {
        id: application.candidate.id,
        fullName: application.candidate.fullName,
        email: application.candidate.email,
        profileId: p?.id ?? null,
        headline: p?.headline ?? null,
        location: p?.location ?? null,
        skills: p?.skills ?? [],
        yearsOfExperience: p?.yearsOfExperience ?? null,
        phone: p?.phone ?? null,
        linkedinUrl: p?.linkedinUrl ?? null,
        githubUrl: p?.githubUrl ?? null,
        portfolioUrl: p?.portfolioUrl ?? null,
        resumeUrl: p?.resumeUrl ?? null,
        hasResumeFile: Boolean(p?.resumeFileName),
      };
    }
  }
}
