import { CandidateProfile } from "../entities/candidate-profile.entity";


export class CandidateCardDto {
  id: string;
  fullName: string;
  headline: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  yearsOfExperience: number | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  linkedinUrl: string | null;
  openToWorkSince: Date | null;

  constructor(profile: CandidateProfile) {
    this.id = profile.id;
    this.fullName = profile.user?.fullName ?? "";
    this.headline = profile.headline;
    this.bio = profile.bio;
    this.location = profile.location;
    this.skills = profile.skills ?? [];
    this.yearsOfExperience = profile.yearsOfExperience;
    this.githubUrl = profile.githubUrl;
    this.portfolioUrl = profile.portfolioUrl;
    this.linkedinUrl = profile.linkedinUrl;
    this.openToWorkSince = profile.openToWorkSince;
  }
}