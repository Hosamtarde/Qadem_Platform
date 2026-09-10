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
import { User } from "../../users/entities/user.entity";
import { ApplicationStatus } from "../../../common/enums";

@Entity("applications")
@Unique("UQ_application_job_candidate", ["jobId", "candidateId"])
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true })
  coverLetter: string | null;

  @Index()
  @Column({
    type: "enum",
    enum: ApplicationStatus,
    default: ApplicationStatus.SUBMITTED,
  })
  status: ApplicationStatus;

  @ManyToOne(() => Job, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "jobId" })
  job: Job;

  @Index()
  @Column({ type: "uuid" })
  jobId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "candidateId" })
  candidate: User;

  @Index()
  @Column({ type: "uuid" })
  candidateId: string;

  @Column({ type: "text", nullable: true })
  companyNote: string | null;

  @Column({ type: "timestamp", nullable: true })
  respondedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
