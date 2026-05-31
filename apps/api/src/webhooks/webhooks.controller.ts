import { Controller, Post, Headers, Body, Param, Logger, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../reviews/reviews.service';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('github/:teamId')
  @HttpCode(200)
  async handleGithubWebhook(
    @Param('teamId') teamId: string,
    @Headers('x-github-event') event: string,
    @Body() payload: any,
  ) {
    this.logger.log(`GitHub webhook: ${event} for team ${teamId}`);

    if (event === 'pull_request' && ['opened', 'synchronize'].includes(payload.action)) {
      const pr = payload.pull_request;
      await this.reviewsService.enqueue({
        teamId,
        repo: payload.repository.full_name,
        prNumber: pr.number,
        prTitle: pr.title,
        prUrl: pr.html_url,
        author: pr.user.login,
        baseBranch: pr.base.ref,
        headBranch: pr.head.ref,
      });
      return { queued: true };
    }

    return { received: true };
  }
}
