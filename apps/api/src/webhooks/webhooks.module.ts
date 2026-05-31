import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { ReviewsModule } from '../reviews/reviews.module';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [ReviewsModule, TeamsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
