import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ReviewsService, REVIEW_QUEUE } from './reviews.service';
import { ReviewStatus } from './review.entity';

@Processor(REVIEW_QUEUE)
export class ReviewProcessor {
  private readonly logger = new Logger(ReviewProcessor.name);
  private readonly openai: OpenAI;

  constructor(
    private reviewsService: ReviewsService,
    private config: ConfigService,
  ) {
    this.openai = new OpenAI({ apiKey: this.config.get('OPENAI_API_KEY') });
  }

  @Process('run-review')
  async handleReview(job: Job<{ reviewId: string }>): Promise<void> {
    const { reviewId } = job.data;
    this.logger.log(`Processing review ${reviewId}`);
    await this.reviewsService.update(reviewId, { status: ReviewStatus.RUNNING });

    try {
      const review = await this.reviewsService.findOne(reviewId);
      if (!review) throw new Error('Review not found');

      const prompt = `You are an expert code reviewer. Review this pull request:

PR: ${review.prTitle}
Repo: ${review.repo}
Author: ${review.author}
Branch: ${review.headBranch} to ${review.baseBranch}

Provide:
1. Overall score (1-10)
2. Issues found
3. Suggestions
4. What was done well

Format as markdown.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      });

      const reviewText = response.choices[0]?.message?.content || '';
      const scoreMatch = reviewText.match(/score[:\s]*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;

      await this.reviewsService.update(reviewId, {
        aiReview: { summary: reviewText, score, generatedAt: new Date().toISOString() },
        overallScore: score,
        status: ReviewStatus.COMPLETED,
      });

      this.logger.log(`Review ${reviewId} completed with score ${score}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Review ${reviewId} failed: ${msg}`);
      await this.reviewsService.update(reviewId, { status: ReviewStatus.FAILED });
    }
  }
}
