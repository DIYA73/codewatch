import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll() { return this.teamsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.teamsService.findById(id); }

  @Post()
  create(@Body() body: { name: string }) {
    return this.teamsService.create(body.name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.teamsService.update(id, body);
  }
}
