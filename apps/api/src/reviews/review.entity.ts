import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReviewStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @Column()
  repo: string;

  @Column()
  prNumber: number;

  @Column()
  prTitle: string;

  @Column()
  prUrl: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  baseBranch: string;

  @Column({ nullable: true })
  headBranch: string;

  @Column({ type: 'text', nullable: true })
  diff: string;

  @Column({ type: 'jsonb', nullable: true })
  aiReview: Record<string, unknown>;

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  @Column({ nullable: true })
  githubCommentId: string;

  @Column({ nullable: true })
  emailSentAt: Date;

  @Column({ default: 0 })
  issuesFound: number;

  @Column({ default: 0 })
  suggestionsCount: number;

  @Column({ nullable: true })
  overallScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
