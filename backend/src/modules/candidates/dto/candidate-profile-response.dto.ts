export class CandidateProfileResponseDto {
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
  createdAt: Date;
  updatedAt: Date;

  constructor(profile: {
    id: string;
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
    resumeFileName: string | null;
    resumeOriginalName: string | null;
    createdAt: Date;
    updatedAt: Date;
    user?: { fullName: string; email: string };
  }) {
    this.id = profile.id;
    this.fullName = profile.user?.fullName ?? "";
    this.email = profile.user?.email ?? "";
    this.headline = profile.headline;
    this.bio = profile.bio;
    this.phone = profile.phone;
    this.location = profile.location;
    this.skills = profile.skills ?? [];
    this.yearsOfExperience = profile.yearsOfExperience;
    this.linkedinUrl = profile.linkedinUrl;
    this.githubUrl = profile.githubUrl;
    this.portfolioUrl = profile.portfolioUrl;
    this.resumeUrl = profile.resumeUrl;
    this.resumeOriginalName = profile.resumeOriginalName;
    this.hasResumeFile = Boolean(profile.resumeFileName);
    this.createdAt = profile.createdAt;
    this.updatedAt = profile.updatedAt;
  }
}
