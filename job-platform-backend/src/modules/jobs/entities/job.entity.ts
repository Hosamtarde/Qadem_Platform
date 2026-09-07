import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company } from "../../companies/entities/company.entity";
import { JobType } from "../../../common/enums";

@Entity("jobs")
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text", nullable: true })
  requirements: string | null;

  @Index()
  @Column({ type: "enum", enum: JobType })
  type: JobType;

  @Index()
  @Column()
  location: string;

  @Column({ type: "int", nullable: true })
  salaryMin: number | null;

  @Column({ type: "int", nullable: true })
  salaryMax: number | null;

  @Index()
  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @ManyToOne(() => Company, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "companyId" })
  company: Company;

  @Index()
  @Column({ type: "uuid" })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
