import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Review } from './review.entity';
import { ReviewsService, REVIEW_QUEUE } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewProcessor } from './review.processor';
import { GithubModule } from '../github/github.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    BullModule.registerQueue({ name: REVIEW_QUEUE }),
    GithubModule,
  ],
  providers: [ReviewsService, ReviewProcessor],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
