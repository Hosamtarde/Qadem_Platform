import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { NotificationResponseDto } from "./dto/notification-response.dto";
import { CurrentUser } from "../../common/decorators";

@ApiTags("notifications")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiQuery({ name: "limit", required: false, type: Number })
  @Get()
  async findMine(
    @CurrentUser("id") userId: string,
    @Query("limit") limit?: string,
  ) {
    const parsed = limit ? parseInt(limit, 10) : 20;
    const notifications = await this.notificationsService.findForUser(
      userId,
      Number.isFinite(parsed) && parsed > 0 ? parsed : 20,
    );
    return notifications.map((n) => new NotificationResponseDto(n));
  }


  @Get("unread-count")
  async unreadCount(@CurrentUser("id") userId: string) {
    const count = await this.notificationsService.countUnread(userId);
    return { count };
  }


  @HttpCode(HttpStatus.OK)
  @Patch(":id/read")
  async markAsRead(
    @CurrentUser("id") userId: string,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    const notification = await this.notificationsService.markAsRead(userId, id);
    return new NotificationResponseDto(notification);
  }

  
  @HttpCode(HttpStatus.OK)
  @Patch("read-all")
  async markAllAsRead(@CurrentUser("id") userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}