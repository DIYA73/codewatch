import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { ConfigService } from '@nestjs/config';
import { ReviewsService, REVIEW_QUEUE } from './reviews.service';
import { ReviewStatus } from './review.entity';

@Processor(REVIEW_QUEUE)
export class ReviewProcessor {
  private readonly logger = new Logger(ReviewProcessor.name);

  constructor(
    private reviewsService: ReviewsService,
    private config: ConfigService,
  ) {}

  @Process('run-review')
  async handleReview(job: Job<{ reviewId: string }>): Promise<void> {
    const { reviewId } = job.data;
    this.logger.log(`Processing review ${reviewId}`);
    await this.reviewsService.update(reviewId, { status: ReviewStatus.RUNNING });

    try {
      const review = await this.reviewsService.findOne(reviewId);
      if (!review) throw new Error('Review not found');

      // Mock AI review — replace with real OpenAI when credits available
      const reviewText = `## Code Review: ${review.prTitle}

**Overall Score: 8/10**

### ✅ What was done well
- Clean commit message following conventional commits format
- Branch naming follows kebab-case convention
- Changes are focused and atomic

### 🔍 Issues Found
- No unit tests added for the new functionality
- Consider adding JSDoc comments to exported functions

### 💡 Suggestions
- Add error boundary handling for edge cases
- Consider extracting repeated logic into a shared utility
- Run \`npm run lint\` before merging

### 📊 Summary
This PR looks solid overall. The main concern is the lack of test coverage. Consider adding at least basic unit tests before merging to main.`;

      await this.reviewsService.update(reviewId, {
        aiReview: { summary: reviewText, score: 8, generatedAt: new Date().toISOString() },
        overallScore: 8,
        status: ReviewStatus.COMPLETED,
      });

      this.logger.log(`Review ${reviewId} completed with score 8`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(`Review ${reviewId} failed: ${msg}`);
      await this.reviewsService.update(reviewId, { status: ReviewStatus.FAILED });
    }
  }
}
