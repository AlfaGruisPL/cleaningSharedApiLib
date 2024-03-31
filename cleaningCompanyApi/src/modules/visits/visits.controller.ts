import { Controller, Get, Query } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitStatisticService } from './visitStatistic.service';
import { ApiDefaultResponse } from '@nestjs/swagger';
import { StatisticDto } from './dto/statistic.dto';
import { RealIP } from 'nestjs-real-ip';
import { Roles } from '../../auth/guards/roles.decorator';
import { Role } from '../../auth/guards/role.enum';

@Controller('visits')
export class VisitsController {
  constructor(
    private readonly visitsService: VisitsService,
    private readonly stats: VisitStatisticService,
  ) {}

  @Get('')
  ponger(
    @Query('code') code: string,
    @Query('id') id: number,
    @RealIP() ip: string,
  ) {
    return this.visitsService.ponger(code, id, ip);
  }

  @ApiDefaultResponse({ type: StatisticDto })
  @Get('/stats')
  statistic() {
    return this.stats.getStatistic();
  }

  @Roles(Role.admin)
  @Get('/activeUser')
  activeUser() {
    return this.stats.activeUser();
  }

  @Roles(Role.admin)
  @Get('/activeUserCity')
  activeUserCity() {
    return this.stats.activeUserCity();
  }

  @Roles(Role.admin)
  @Get('/visitStatistic')
  visitStatistic() {
    return this.stats.visitStatistic();
  }

  @Roles(Role.admin)
  @Get('/miniStatistic')
  miniStatistic() {
    return this.stats.miniStatistic();
  }
}
