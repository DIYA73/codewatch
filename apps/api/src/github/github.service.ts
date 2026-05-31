import { Injectable, Logger } from '@nestjs/common';
import { Octokit } from '@octokit/rest';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  getOctokit(token: string): Octokit {
    return new Octokit({ auth: token });
  }

  async postReviewComment(token: string, owner: string, repo: string, pull_number: number, body: string): Promise<number> {
    const octokit = this.getOctokit(token);
    const { data } = await octokit.rest.issues.createComment({
      owner, repo, issue_number: pull_number, body,
    });
    return data.id;
  }

  parseRepoFullName(fullName: string): { owner: string; repo: string } {
    const [owner, repo] = fullName.split('/');
    return { owner, repo };
  }
}
