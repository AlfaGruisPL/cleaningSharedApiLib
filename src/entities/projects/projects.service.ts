import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './entity/project.entity';
import { ProjectDto } from './dto/Project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectEntityRepository: Repository<ProjectEntity>,
  ) {}

  async allProjects() {
    return this.projectEntityRepository.find();
  }

  async oneProject(id: number) {
    return await this.projectEntityRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async addProject(body: ProjectDto) {
    const tmp = new ProjectEntity();
    tmp.title = body.title;
    tmp.content = body.content;
    await this.projectEntityRepository.save(tmp);
  }

  async deleteProject(id: number) {
    await this.projectEntityRepository.delete({ id: id });
  }

  async changeProject(body: ProjectDto, id: number) {
    return this.projectEntityRepository.update({ id: id }, body);
  }
}
