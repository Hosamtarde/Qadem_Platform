import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Notification } from "./entities/notification.entity";
import { User } from "../users/entities/user.entity";
import { MailService } from "../mail/mail.service";
import { notificationEmail } from "../mail/mail.templates";
import { NotificationType } from "../../common/enums";

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
  sendEmail?: boolean;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}


  async create(
    input: CreateNotificationInput,
    manager?: EntityManager,
  ): Promise<Notification> {
    const repo = manager
      ? manager.getRepository(Notification)
      : this.notificationsRepository;

    const notification = await repo.save(
      repo.create({
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body ?? null,
        link: input.link ?? null,
      }),
    );

    if (input.sendEmail !== false) {
      void this.deliverEmail(input, manager);
    }

    return notification;
  }

  async findForUser(userId: string, limit = 20): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: Math.min(limit, 50),
    });
  }

  async countUnread(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(userId: string, id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException("Notification not found");
    }

    if (!notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date();
      await this.notificationsRepository.save(notification);
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.notificationsRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    return { updated: result.affected ?? 0 };
  }


  private async deliverEmail(
    input: CreateNotificationInput,
    manager?: EntityManager,
  ): Promise<void> {
    try {
      const usersRepo = manager
        ? manager.getRepository(User)
        : this.notificationsRepository.manager.getRepository(User);

      const user = await usersRepo.findOne({ where: { id: input.userId } });
      if (!user) return;

      const base = this.configService.get<string>("FRONTEND_URL") ?? "";
      const url = input.link ? `${base}${input.link}` : base;

      await this.mailService.send(
        user.email,
        input.title,
        notificationEmail(user.fullName, input.title, input.body ?? null, url),
      );
    } catch (err) {
      this.logger.error(
        `Could not email notification to ${input.userId}`,
        err as Error,
      );
    }
  }
}