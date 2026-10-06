import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryFailedError, Repository } from "typeorm";
import { Invitation } from "./entities/invitation.entity";
import { Application } from "../applications/entities/application.entity";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { RespondInvitationDto } from "./dto/respond-invitation.dto";
import { JobsService } from "../jobs/jobs.service";
import { CompaniesService } from "../companies/companies.service";
import { CandidatesService } from "../candidates/candidates.service";
import { NotificationsService } from "../notifications/notifications.service";
import {
  ApplicationStatus,
  InvitationStatus,
  NotificationType,
} from "../../common/enums";

const EXPIRY_DAYS = 14;

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationsRepository: Repository<Invitation>,
    private readonly jobsService: JobsService,
    private readonly companiesService: CompaniesService,
    private readonly candidatesService: CandidatesService,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  async invite(
    userId: string,
    dto: CreateInvitationDto,
  ): Promise<Invitation> {
    const company = await this.companiesService.findByUserId(userId);
    const job = await this.jobsService.findById(dto.jobId);

    if (job.companyId !== company.id) {
      throw new ForbiddenException(
        "You can only invite candidates to your own postings",
      );
    }

    if (!job.isActive) {
      throw new BadRequestException(
        "This posting is paused. Publish it before inviting candidates",
      );
    }

    const profile = await this.candidatesService.findById(
      dto.candidateProfileId,
    );

    if (!profile.isOpenToWork) {
      throw new ForbiddenException(
        "This candidate is not open to work right now",
      );
    }

    const alreadyApplied = await this.dataSource
      .getRepository(Application)
      .findOne({ where: { jobId: job.id, candidateId: profile.userId } });

    if (alreadyApplied) {
      throw new ConflictException(
        "This candidate has already applied to this posting",
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + EXPIRY_DAYS);

    const invitation = this.invitationsRepository.create({
      jobId: job.id,
      companyId: company.id,
      candidateId: profile.userId,
      message: dto.message ?? null,
      status: InvitationStatus.PENDING,
      expiresAt,
    });

    let saved: Invitation;
    try {
      saved = await this.invitationsRepository.save(invitation);
    } catch (err) {
      if (err instanceof QueryFailedError && this.isUniqueViolation(err)) {
        throw new ConflictException(
          "You have already invited this candidate to this posting",
        );
      }
      throw err;
    }

    await this.notificationsService.create({
      userId: profile.userId,
      type: NotificationType.INVITATION_RECEIVED,
      title: `${company.name} invited you to apply for ${job.title}`,
      body: "Open your invitations to accept or decline.",
      link: "/dashboard/invitations",
    });

    return this.findOneWithRelations(saved.id);
  }

  async findForCandidate(candidateId: string): Promise<Invitation[]> {
    const invitations = await this.invitationsRepository.find({
      where: { candidateId },
      relations: { job: true, company: true },
      order: { createdAt: "DESC" },
    });

    return this.markExpired(invitations);
  }

  async findForCompany(userId: string): Promise<Invitation[]> {
    const company = await this.companiesService.findByUserId(userId);

    const invitations = await this.invitationsRepository.find({
      where: { companyId: company.id },
      relations: { job: true, candidate: true },
      order: { createdAt: "DESC" },
    });

    return this.markExpired(invitations);
  }

  async countPending(candidateId: string): Promise<number> {
    return this.invitationsRepository.count({
      where: { candidateId, status: InvitationStatus.PENDING },
    });
  }

  async respond(
    candidateId: string,
    id: string,
    dto: RespondInvitationDto,
  ): Promise<Invitation> {
    const result = await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Invitation);

      const invitation = await repo.findOne({
        where: { id },
        relations: { job: true, company: true },
      });

      if (!invitation || invitation.candidateId !== candidateId) {
        throw new NotFoundException("Invitation not found");
      }

      if (invitation.status !== InvitationStatus.PENDING) {
        throw new BadRequestException(
          `This invitation was already ${invitation.status.toLowerCase()}`,
        );
      }

      if (invitation.expiresAt < new Date()) {
        invitation.status = InvitationStatus.EXPIRED;
        await repo.save(invitation);
        throw new BadRequestException("This invitation has expired");
      }

      invitation.status = dto.status;
      invitation.respondedAt = new Date();

      if (dto.status === InvitationStatus.DECLINED) {
        invitation.declineReason = dto.declineReason ?? null;
      }

      const saved = await repo.save(invitation);


      if (dto.status === InvitationStatus.ACCEPTED) {
        const applications = manager.getRepository(Application);

        const existing = await applications.findOne({
          where: { jobId: invitation.jobId, candidateId },
        });

        if (!existing) {
          await applications.save(
            applications.create({
              jobId: invitation.jobId,
              candidateId,
              status: ApplicationStatus.REVIEWING,
              coverLetter: null,
            }),
          );
        }
      }

      const accepted = dto.status === InvitationStatus.ACCEPTED;

      await this.notificationsService.create(
        {
          userId: invitation.company.userId,
          type: NotificationType.INVITATION_ANSWERED,
          title: accepted
            ? `Your invitation for ${invitation.job.title} was accepted`
            : `Your invitation for ${invitation.job.title} was declined`,
          body: accepted
            ? "The candidate now appears in your applicants."
            : (dto.declineReason ?? "No reason given."),
          link: accepted ? "/dashboard/applicants" : "/dashboard/invitations",
        },
        manager,
      );

      return saved;
    });

    return this.findOneWithRelations(result.id);
  }

  private async findOneWithRelations(id: string): Promise<Invitation> {
    const invitation = await this.invitationsRepository.findOne({
      where: { id },
      relations: { job: true, company: true, candidate: true },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    return invitation;
  }


  private async markExpired(invitations: Invitation[]): Promise<Invitation[]> {
    const now = new Date();
    const stale = invitations.filter(
      (i) => i.status === InvitationStatus.PENDING && i.expiresAt < now,
    );

    if (stale.length > 0) {
      await this.invitationsRepository.update(
        stale.map((i) => i.id),
        { status: InvitationStatus.EXPIRED },
      );
      stale.forEach((i) => {
        i.status = InvitationStatus.EXPIRED;
      });
    }

    return invitations;
  }

  private isUniqueViolation(err: QueryFailedError): boolean {
    const code = (err as unknown as { code?: string }).code;
    return code === "23505";
  }
}