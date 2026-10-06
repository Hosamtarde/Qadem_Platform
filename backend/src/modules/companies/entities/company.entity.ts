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

@Entity("companies")
export class Company {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({ type: "varchar", nullable: true })
  website!: string | null;

  @Column({ type: "varchar", nullable: true })
  location!: string | null;

  @Column({ type: "varchar", nullable: true })
  logoUrl!: string | null;

  @OneToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
  responseRate!: string | null;

  @Column({ type: "numeric", precision: 6, scale: 2, nullable: true })
  avgResponseDays!: string | null;

  @Column({ type: "int", default: 0 })
  responseSampleSize!: number;

  @Column({ type: "timestamp", nullable: true })
  responseStatsAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
