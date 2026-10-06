import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { NotificationType } from "../../../common/enums";

@Entity("notifications")
@Index("IDX_notification_inbox", ["userId", "isRead", "createdAt"])
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "enum", enum: NotificationType })
  type!: NotificationType;

  @Column({ type: "varchar", length: 200 })
  title!: string;

  @Column({ type: "text", nullable: true })
  body!: string | null;

  @Column({ type: "varchar", nullable: true })
  link!: string | null;

  @Column({ type: "boolean", default: false })
  isRead!: boolean;

  @Column({ type: "timestamp", nullable: true })
  readAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}