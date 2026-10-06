import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { promises as fs } from "fs";
import { join } from "path";
import { CandidateProfile } from "./entities/candidate-profile.entity";
import { UpdateCandidateProfileDto } from "./dto/update-candidate-profile.dto";
import { SearchCandidatesDto } from "./dto/search-candidates.dto";

export const RESUME_DIR = join(process.cwd(), "uploads", "resumes");

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(CandidateProfile)
    private readonly profilesRepository: Repository<CandidateProfile>,
  ) {}

  async createForUser(userId: string): Promise<CandidateProfile> {
    const profile = this.profilesRepository.create({ userId, skills: [] });
    return this.profilesRepository.save(profile);
  }

  async findByUserId(userId: string): Promise<CandidateProfile> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: { user: true },
    });

    if (!profile) {
      throw new NotFoundException("Candidate profile not found");
    }

    return profile;
  }

  async findById(id: string): Promise<CandidateProfile> {
    const profile = await this.profilesRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!profile) {
      throw new NotFoundException("Candidate profile not found");
    }

    return profile;
  }

  async search(dto: SearchCandidatesDto): Promise<{
    items: CandidateProfile[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const pageSize = 12;
    const page = dto.page && dto.page > 0 ? dto.page : 1;

    const qb = this.profilesRepository
      .createQueryBuilder("profile")
      .innerJoinAndSelect("profile.user", "user")
      .where("profile.isOpenToWork = true");

    if (dto.skills?.length) {
      qb.andWhere("profile.skills && :skills", { skills: dto.skills });
    }

    if (dto.location) {
      qb.andWhere("profile.location ILIKE :location", {
        location: `%${dto.location}%`,
      });
    }

    if (dto.minYears !== undefined) {
      qb.andWhere("profile.yearsOfExperience >= :minYears", {
        minYears: dto.minYears,
      });
    }

    if (dto.q) {
      qb.andWhere(
        "(user.fullName ILIKE :q OR profile.headline ILIKE :q OR profile.bio ILIKE :q)",
        { q: `%${dto.q}%` },
      );
    }

    const [items, total] = await qb
      .orderBy("profile.openToWorkSince", "DESC", "NULLS LAST")
      .addOrderBy("profile.updatedAt", "DESC")
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize };
  }  

  async updateByUserId(
    userId: string,
    dto: UpdateCandidateProfileDto,
  ): Promise<CandidateProfile> {
    const profile = await this.findByUserId(userId);

    if (dto.skills) {
      const cleaned = dto.skills
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      profile.skills = Array.from(new Set(cleaned));
      delete dto.skills;
    }

    if (
      dto.isOpenToWork !== undefined &&
      dto.isOpenToWork !== profile.isOpenToWork
    ) {
      profile.openToWorkSince = dto.isOpenToWork ? new Date() : null;
    }

    Object.assign(profile, dto);
    return this.profilesRepository.save(profile);
  }

  async attachResume(
    userId: string,
    file: Express.Multer.File,
  ): Promise<CandidateProfile> {
    const profile = await this.findByUserId(userId);

    if (profile.resumeFileName) {
      await this.removeFile(profile.resumeFileName);
    }

    profile.resumeFileName = file.filename;
    profile.resumeOriginalName = this.safeName(file.originalname);

    return this.profilesRepository.save(profile);
  }

  async removeResume(userId: string): Promise<CandidateProfile> {
    const profile = await this.findByUserId(userId);

    if (!profile.resumeFileName) {
      throw new BadRequestException("There is no uploaded resume to remove");
    }

    await this.removeFile(profile.resumeFileName);
    profile.resumeFileName = null;
    profile.resumeOriginalName = null;

    return this.profilesRepository.save(profile);
  }

  async getResumePath(
    profileId: string,
  ): Promise<{ path: string; originalName: string }> {
    const profile = await this.findById(profileId);

    if (!profile.resumeFileName) {
      throw new NotFoundException("This candidate has no uploaded resume");
    }

    return {
      path: join(RESUME_DIR, profile.resumeFileName),
      originalName: profile.resumeOriginalName ?? "resume.pdf",
    };
  }

  private safeName(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
  }

  private async removeFile(fileName: string): Promise<void> {
    try {
      await fs.unlink(join(RESUME_DIR, fileName));
    } catch {
      
    }
  }
}