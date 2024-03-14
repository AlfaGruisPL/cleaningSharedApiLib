import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import { ActiveUserEntity } from './entity/activeUser.entity';
import ms from 'ms';
import axios from 'axios';
import md5 from 'md5';
import { ActiveUserDetailEntity } from './entity/ActiveUserDetail.entity';

@Injectable()
export class VisitsService {
  visits: Array<{ id: number; date: Date }> = [];

  constructor(
    @InjectRepository(ActiveUserEntity)
    private activeUserEntityRepository: Repository<ActiveUserEntity>,
    @InjectRepository(ActiveUserDetailEntity)
    private ActiveUserDetailRepository: Repository<ActiveUserDetailEntity>,
  ) {}

  async ponger(code: string, id: number, ip: string) {
    var find = false;
    for (let k = -5; k < 2; k++) {
      if (this.generateMd5(k) == code) find = true;
    }
    if (!find) {
      //   console.log('no find: ' + ip);
      //     return { id: undefined };
    }
    if (id && id != 0) {
      console.log(id);
      return await this.backUser(code, id, ip);
    }

    return await this.newUser(code, ip);
  }

  async backUser(code: string, id: number, ip: string) {
    const k = await this.activeUserEntityRepository.findOne({
      where: {
        visitId: id.toString(),
      },
    });

    if (!k) {
      //   console.log('back not found');
      return await this.newUser(code, ip);
    }
    const timeInSeconds = Math.round(
      (new Date().getTime() - k.date.getTime()) / ms('1s'),
    );
    if (timeInSeconds > 60 * 30) {
      //to long after 30 minuts
      //  console.log('to long: ', timeInSeconds, 's z ', 60 * 30);
      return await this.newUser(code, ip);
    }

    k.visitTime += 10;
    k.date = new Date();
    k.active = true;
    await this.activeUserEntityRepository.save(k);
    const tmp = new ActiveUserDetailEntity();
    tmp.date = new Date();
    tmp.ActiveUser = k;
    await this.ActiveUserDetailRepository.save(tmp);
    /*   console.log(
         k.id +
           ' --- ' +
           Number(
             (new Date(k.date).getTime() - new Date(k.createTime).getTime()) /
               ms('60s'),
           ).toFixed(3) +
           'minut',
       );*/
  }

  async newUser(code: string, ip: string) {
    const idToBack = Math.round(
      Math.random() * 99999 + new Date().getTime() + Math.random() * 9900999,
    );
    const tmp = new ActiveUserEntity();
    tmp.visitId = idToBack.toString();
    tmp.date = new Date();
    try {
      console.log(ip);
      const { city, country_code, latitude, longitude } = (
        await axios.get(`https://ipapi.co/${ip}/json`)
      ).data as {
        ip: string;
        version: string;
        city: string;
        region: string;
        region_code: string;
        country_code: string;
        country_code_iso3: string;
        country_name: string;
        country_capital: string;
        country_tld: string;
        continent_code: string;
        in_eu: false;
        postal: string;
        latitude: string;
        longitude: string;
        timezone: string;
        utc_offset: string;
        country_calling_code: string;
        currency: string;
        currency_name: string;
        languages: string;
        country_area: string;
        country_population: string;
        asn: string;
        org: string;
        hostname: string;
      };
      tmp.location_city = city;
      tmp.location_country_code = country_code;
      tmp.location_latitude = latitude;
      tmp.location_longitude = longitude;
      tmp.location_ip_md5 = md5(ip);
      await this.activeUserEntityRepository.save(tmp);
      // console.log('nowe id:', tmp.visitId);
      return { id: tmp.visitId };
    } catch (error) {
      //  console.log('nowe id:', tmp.visitId);
      await this.activeUserEntityRepository.save(tmp);
      return { id: tmp.visitId };
    }

    //
  }

  generateMd5(time: number) {
    var md5 = require('md5');
    const date =
      new Date().getHours() +
      '*' +
      new Date().getMinutes() +
      '*' +
      (Number(new Date().getSeconds()) + time);
    const value = `${date}`; //^${link}
    //return value;
    return md5(value);
  }

  async deleteNoActiveUser() {
    const currentDateTime = new Date();
    const expirationDate = new Date(currentDateTime);
    expirationDate.setSeconds(expirationDate.getSeconds() - 30);
    const k = await this.activeUserEntityRepository.update(
      {
        date: Not(MoreThan(expirationDate)),
      },
      { active: false },
    );
  }

  async stats() {
    const active = await this.activeUserEntityRepository.count({
      where: {
        active: true,
        date: MoreThan(new Date(new Date().setHours(0, 0, 0, 1))),
      },
    });
    const today = await this.activeUserEntityRepository.count({
      where: {
        date: MoreThan(new Date(new Date().setHours(0, 0, 0, 1))),
      },
    });
    return { active: active, today: today };
  }
}
