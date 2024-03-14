import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VisitsService } from './modules/visits/visits.service';
import { VisitStatisticService } from './modules/visits/visitStatistic.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private visit_: VisitsService,
    private stats_: VisitStatisticService,
  ) {}

  @Cron('*/25 * * * * *')
  async deleteNoActiveUser() {
    await this.visit_.deleteNoActiveUser();
    //  this.logger.debug('Called every 15 second');
  }

  @Cron('2 0 * * *') // 00:02 every day
  async calcStats1() {
    await this.stats_.calculateVisit();
    this.logger.debug('Calculate visit statistic (at 00:02)');
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async calcStats2() {
    await this.stats_.calculateVisit();
    this.logger.debug('Calculate visit statistic (every 4 hours)');
  }
}
