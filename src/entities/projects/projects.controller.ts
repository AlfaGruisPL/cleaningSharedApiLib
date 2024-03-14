import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiOperation } from '@nestjs/swagger';
import { ProjectDto } from './dto/Project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Dane dotyczące wszystkich projektów' })
  @Get('')
  async all() {
    return await this.projectsService.allProjects();
  }

  @ApiOperation({ summary: 'Dane dotyczące pojedyńczego projektu' })
  @Get('/:id')
  async one(@Param('id') id: number) {
    return await this.projectsService.oneProject(id);
  }

  @Post('')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addAspect(@Body() body: ProjectDto) {
    return await this.projectsService.addProject(body);
  }

  @ApiOperation({ summary: 'Dane dotyczące pojedyńczej aktywności' })
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.projectsService.deleteProject(id);
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async changeAspect(@Body() body: ProjectDto, @Param('id') id: number) {
    return await this.projectsService.changeProject(body, id);
  }
}
