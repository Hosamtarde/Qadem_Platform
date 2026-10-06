import { ApiProperty } from "@nestjs/swagger";
import { Notification } from "../entities/notification.entity";
import { NotificationType } from "../../../common/enums";

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  body: string | null;

  @ApiProperty({ nullable: true })
  link: string | null;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty()
  createdAt: Date;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.type = notification.type;
    this.title = notification.title;
    this.body = notification.body;
    this.link = notification.link;
    this.isRead = notification.isRead;
    this.createdAt = notification.createdAt;
  }
}