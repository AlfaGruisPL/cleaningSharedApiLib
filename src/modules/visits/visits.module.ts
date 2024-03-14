import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveUserEntity } from './entity/activeUser.entity';
import { VisitStatisticEntity } from './entity/visitStatistic.entity';
import { VisitStatisticService } from './visitStatistic.service';
import { ActiveUserDetailEntity } from './entity/ActiveUserDetail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActiveUserEntity]),
    TypeOrmModule.forFeature([ActiveUserDetailEntity]),
    TypeOrmModule.forFeature([VisitStatisticEntity]),
  ],
  controllers: [VisitsController],
  providers: [VisitsService, VisitStatisticService],
  exports: [VisitsService, VisitStatisticService],
})
export class VisitsModule {}
