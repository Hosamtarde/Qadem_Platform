import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Job } from "../../jobs/entities/job.entity";
import { Company } from "../../companies/entities/company.entity";
import { User } from "../../users/entities/user.entity";
import { InvitationStatus } from "../../../common/enums";

@Entity("invitations")
@Unique("UQ_invitation_job_candidate", ["jobId", "candidateId"])
@Index("IDX_invitation_candidate_inbox", ["candidateId", "status", "createdAt"])
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Job, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "jobId" })
  job!: Job;

  @Index()
  @Column({ type: "uuid" })
  jobId!: string;

  @ManyToOne(() => Company, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "companyId" })
  company!: Company;

  @Index()
  @Column({ type: "uuid" })
  companyId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "candidateId" })
  candidate!: User;

  @Column({ type: "uuid" })
  candidateId!: string;

  @Column({ type: "text", nullable: true })
  message!: string | null;

  @Column({
    type: "enum",
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status!: InvitationStatus;

  @Column({ type: "text", nullable: true })
  declineReason!: string | null;

  @Column({ type: "timestamp" })
  expiresAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  respondedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}