import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Queue } from 'bull';
import { Review, ReviewStatus } from './review.entity';

export const REVIEW_QUEUE = 'review';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectQueue(REVIEW_QUEUE) private reviewQueue: Queue,
    @InjectRepository(Review) private repo: Repository<Review>,
  ) {}

  async enqueue(data: Partial<Review>): Promise<Review> {
    const review = this.repo.create({ ...data, status: ReviewStatus.PENDING });
    const saved = await this.repo.save(review);
    await this.reviewQueue.add('run-review', { reviewId: saved.id }, {
      attempts: 2,
      backoff: { type: 'exponential', delay: 3000 },
    });
    return saved;
  }

  async findByTeam(teamId: string): Promise<Review[]> {
    return this.repo.find({ where: { teamId }, order: { createdAt: 'DESC' }, take: 50 });
  }

  async findOne(id: string): Promise<Review | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Review>): Promise<void> {
    await this.repo.createQueryBuilder()
      .update(Review)
      .set(data as any)
      .where('id = :id', { id })
      .execute();
  }

  async getStats(teamId: string) {
    const total = await this.repo.count({ where: { teamId } });
    const completed = await this.repo.count({ where: { teamId, status: ReviewStatus.COMPLETED } });
    const failed = await this.repo.count({ where: { teamId, status: ReviewStatus.FAILED } });
    return { total, completed, failed, successRate: total ? Math.round((completed / total) * 100) : 0 };
  }
}
