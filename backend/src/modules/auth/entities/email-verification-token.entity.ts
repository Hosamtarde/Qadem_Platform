import {
  Column, CreateDateColumn, Entity, Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('email_verification_tokens')
export class EmailVerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  tokenHash!: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  usedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}