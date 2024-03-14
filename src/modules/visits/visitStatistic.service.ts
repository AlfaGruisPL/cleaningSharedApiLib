import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ActiveUserEntity } from './entity/activeUser.entity';
import { VisitStatisticEntity } from './entity/visitStatistic.entity';
import { StatisticDto } from './dto/statistic.dto';
import { ActiveUserDetailEntity } from './entity/ActiveUserDetail.entity';

@Injectable()
export class VisitStatisticService {
  visits: Array<{ id: number; date: Date }> = [];

  constructor(
    @InjectRepository(ActiveUserEntity)
    private activeUserEntityRepository: Repository<ActiveUserEntity>,
    @InjectRepository(VisitStatisticEntity)
    private visitStatisticRepository: Repository<VisitStatisticEntity>,
    @InjectRepository(ActiveUserDetailEntity)
    private ActiveUserDetailRepository: Repository<ActiveUserDetailEntity>,
  ) {}

  async calculateVisit() {
    const currentDateTime = new Date();
    currentDateTime.setHours(0, 0, 0, 0);
    return await this.visitStatisticRepository.manager
      .transaction(async (entityManager) => {
        const k = await entityManager
          .getRepository(ActiveUserEntity)
          .createQueryBuilder('activeUser')
          .select('DAy(activeUser.date) AS day, activeUser.date as fullDate')
          .addSelect('AVG(activeUser.visitTime) as avgTimeOnWebsite')
          .addSelect('SUM(activeUser.visitTime) as sumTimeOnWebsite')
          .addSelect('COUNT(*) as visitInDay')
          .groupBy('day')
          .having('day != DAY(NOW())')
          .orderBy('DAY', 'DESC')
          .getRawMany();

        const next = k;
        for (const data of k) {
          const tmp = new VisitStatisticEntity();
          tmp.avgVisitTime = data['avgTimeOnWebsite'];
          tmp.sumTimeOnWebsite = data['sumTimeOnWebsite'];
          tmp.visits = data['visitInDay'];
          tmp.date = new Date(data['fullDate']);
          await entityManager.save(tmp);
        }
        const result = await entityManager
          .getRepository(ActiveUserEntity)
          .createQueryBuilder()
          .delete()
          .from(ActiveUserEntity)
          .where('DAY(date) != DAY(NOW())')
          .execute();
        return { data: next, delete: result };
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  async getStatistic(): Promise<StatisticDto> {
    const today = new Date();
    const yesterdayStart = new Date(today);
    yesterdayStart.setDate(today.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayStop = new Date(today);
    yesterdayStop.setDate(today.getDate() - 1);
    yesterdayStop.setHours(23, 59, 59, 59);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Ustawia początek tygodnia na niedzielę
    const endOfWeek = new Date(today);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 59);

    const startOfYear = new Date(today.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 59);
    try {
      const [
        yesterdayStats,
        thisWeekStats,
        thisMonthStats,
        thisYearStats,
        totalStats,
        activeNow,
        totalToday,
      ] = await Promise.all([
        this.visitStatisticRepository.sum('visits', {
          date: Between(yesterdayStart, yesterdayStop),
        }),
        this.visitStatisticRepository.sum('visits', {
          date: Between(startOfWeek, endOfWeek),
        }),
        this.visitStatisticRepository.sum('visits', {
          date: Between(startOfMonth, endOfMonth),
        }),
        this.visitStatisticRepository.sum('visits', {
          date: Between(startOfYear, endOfYear),
        }),
        this.visitStatisticRepository.sum('visits'),
        this.activeUserEntityRepository.count({ where: { active: true } }),
        this.activeUserEntityRepository.count(),
      ]);
      return {
        activeNow,
        totalToday,
        yesterdayStats,
        thisWeekStats: thisWeekStats + totalToday,
        thisMonthStats: thisMonthStats + totalToday,
        thisYearStats: thisYearStats + totalToday,
        totalStats: totalStats + totalToday,
      };
    } catch (error) {
      // Tutaj obsługa błędów, np. logowanie, rzucanie dalej, etc.
      console.error('Błąd podczas pobierania statystyk:', error);
      throw error;
    }
  }

  async activeUser() {
    const data = (await this.ActiveUserDetailRepository.manager.query(
      "SELECT DATE_FORMAT(date, '%H:%i') AS time, COUNT(DISTINCT activeUserId) AS counter    FROM activeUserDetail    WHERE date >= NOW() - INTERVAL 35 MINUTE    GROUP BY time;",
    )) as Array<{ time: string; counter: string }>;
    const generateTimeSeries = () => {
      const now = new Date();
      const timeSeries = [];

      for (let i = 29; i >= 0; i--) {
        const currentTime = new Date(now.getTime() - i * 60 * 1000);
        const formattedTime = `${String(currentTime.getHours()).padStart(2, '0')}:${String(
          currentTime.getMinutes(),
        ).padStart(2, '0')}`;
        const findVisits = data.find((k) => {
          return k.time == formattedTime;
        });
        let counter: string = '0';
        if (findVisits) {
          counter = findVisits.counter;
        }

        timeSeries.push({ time: formattedTime, counter });
      }
      return timeSeries;
    };
    return generateTimeSeries();
  }

  async activeUserCity() {
    const data = (await this.ActiveUserDetailRepository.manager.query(
      'SELECT COUNT(*) as count,location_city as city  FROM activeUser where ACTIVE = 1 GROUP BY location_city',
    )) as Array<{ count: string; city: string }>;
    return data;
  }

  async visitStatistic() {
    const data = await this.visitStatisticRepository.find({
      take: 710,
      order: {
        date: 'desc',
      },
    });
    const visitsArray = [];
    const AvgTimeArray = [];
    data.forEach((k) => {
      visitsArray.push([k.date, k.visits]);
      AvgTimeArray.push([
        k.date,
        Math.round(k.avgVisitTime / (60 * 100)) / 100,
      ]);
    });
    return { visits: visitsArray, avg: AvgTimeArray };
  }

  async miniStatistic() {
    const activeNow = await this.activeUserEntityRepository.count({
      where: { active: true },
    });
    const avgTimeToday =
      await this.activeUserEntityRepository.average('visitTime');
    const avgTimeTotal =
      await this.visitStatisticRepository.average('avgVisitTime');
    const visitsToday = await this.activeUserEntityRepository.count();
    const sumTimeToday = await this.activeUserEntityRepository.sum('visitTime');
    const sumTimeTotal =
      await this.visitStatisticRepository.sum('sumTimeOnWebsite');
    return {
      activeNow: activeNow,
      avgTimeToday: avgTimeToday,
      avgTimeTotal: avgTimeTotal,
      sumTimeToday: sumTimeToday,
      visitsToday: visitsToday,
      sumTimeTotal: sumTimeTotal + sumTimeToday,
      totalVisits:
        (await this.visitStatisticRepository.sum('visits')) + visitsToday,
    };
  }
}
