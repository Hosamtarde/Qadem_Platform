import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { InvitationsService } from "./invitations.service";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { RespondInvitationDto } from "./dto/respond-invitation.dto";
import { InvitationResponseDto } from "./dto/invitation-response.dto";
import { CurrentUser, Roles } from "../../common/decorators";
import { UserRole } from "../../common/enums";

@ApiTags("invitations")
@ApiBearerAuth()
@Controller("invitations")
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Roles(UserRole.COMPANY)
  @Post()
  async invite(
    @CurrentUser("id") userId: string,
    @Body() dto: CreateInvitationDto,
  ) {
    const invitation = await this.invitationsService.invite(userId, dto);
    return new InvitationResponseDto(invitation);
  }

  @Roles(UserRole.CANDIDATE)
  @Get("my")
  async myInvitations(@CurrentUser("id") candidateId: string) {
    const invitations =
      await this.invitationsService.findForCandidate(candidateId);
    return invitations.map((i) => new InvitationResponseDto(i));
  }

  @Roles(UserRole.CANDIDATE)
  @Get("my/pending-count")
  async pendingCount(@CurrentUser("id") candidateId: string) {
    const count = await this.invitationsService.countPending(candidateId);
    return { count };
  }

  @Roles(UserRole.COMPANY)
  @Get("sent")
  async sentInvitations(@CurrentUser("id") userId: string) {
    const invitations = await this.invitationsService.findForCompany(userId);
    return invitations.map((i) => new InvitationResponseDto(i));
  }

  @Roles(UserRole.CANDIDATE)
  @HttpCode(HttpStatus.OK)
  @Patch(":id/respond")
  async respond(
    @CurrentUser("id") candidateId: string,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: RespondInvitationDto,
  ) {
    const invitation = await this.invitationsService.respond(
      candidateId,
      id,
      dto,
    );
    return new InvitationResponseDto(invitation);
  }
}