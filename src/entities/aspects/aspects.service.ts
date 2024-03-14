import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AspectEntity } from './entity/aspect.entity';
import { AspectDto } from './dto/Aspect.dto';

@Injectable()
export class AspectsService {
  constructor(
    @InjectRepository(AspectEntity)
    private activitiesRepository: Repository<AspectEntity>,
  ) {}

  async allActivities() {
    return this.activitiesRepository.find();
  }

  async oneActivity(id: number) {
    return await this.activitiesRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async addAspect(body: AspectDto) {
    const tmp = new AspectEntity();
    tmp.title = body.title;
    tmp.content = body.content;
    tmp.imageId = body.imageId;
    tmp.shortDescription = body.shortDescription;
    await this.activitiesRepository.save(tmp);
    return tmp;
  }

  async deleteOneActivity(id: number) {
    await this.activitiesRepository.delete({ id: id });
  }

  async changeAspect(body: AspectDto, id: number) {
    return this.activitiesRepository.update({ id: id }, body);
  }
}
