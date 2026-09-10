import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("candidate_profiles")
export class CandidateProfile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  headline: string | null;

  @Column({ type: "text", nullable: true })
  bio: string | null;

  @Column({ type: "varchar", nullable: true })
  phone: string | null;

  @Column({ type: "varchar", nullable: true })
  location: string | null;

  @Column({ type: "text", array: true, default: () => "ARRAY[]::text[]" })
  skills: string[];

  @Column({ type: "int", nullable: true })
  yearsOfExperience: number | null;

  @Column({ type: "varchar", nullable: true })
  linkedinUrl: string | null;

  @Column({ type: "varchar", nullable: true })
  githubUrl: string | null;

  @Column({ type: "varchar", nullable: true })
  portfolioUrl: string | null;

  @Column({ type: "varchar", nullable: true })
  resumeUrl: string | null;

  @Column({ type: "varchar", nullable: true })
  resumeFileName: string | null;

  @Column({ type: "varchar", nullable: true })
  resumeOriginalName: string | null;

  @OneToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "uuid" })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
