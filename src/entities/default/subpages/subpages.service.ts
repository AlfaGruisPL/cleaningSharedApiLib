import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubpageEntity } from './entity/subpage.entity';

@Injectable()
export class SubpagesService {
  constructor(
    @InjectRepository(SubpageEntity)
    private subPageRepository: Repository<SubpageEntity>,
  ) {}

  async getSubpage(reg: Request, id: number) {
    return await this.subPageRepository.findOneOrFail({
      where: {
        id: id,
      },
    });
  }

  async getAllSubpage(reg: Request) {
    return await this.subPageRepository.findOneOrFail({});
  }
}
