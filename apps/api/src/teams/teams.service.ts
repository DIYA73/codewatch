import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(@InjectRepository(Team) private repo: Repository<Team>) {}

  async create(name: string): Promise<Team> {
    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const team = this.repo.create({ name, slug });
    return this.repo.save(team);
  }

  async findById(id: string): Promise<Team> {
    const team = await this.repo.findOne({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: string, data: Partial<Team>): Promise<Team> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async findAll(): Promise<Team[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }
}
