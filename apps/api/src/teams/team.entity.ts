import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  githubOrg: string;

  @Column({ nullable: true })
  githubInstallationId: string;

  @Column({ nullable: true })
  openaiApiKey: string;

  @Column({ default: 'gpt-4o' })
  aiModel: string;

  @Column({ default: true })
  postGithubComments: boolean;

  @Column({ default: true })
  sendEmailSummary: boolean;

  @Column({ nullable: true })
  notificationEmail: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
