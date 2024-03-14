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
import { AspectsService } from './aspects.service';
import { ApiOperation } from '@nestjs/swagger';
import { AspectDto } from './dto/Aspect.dto';

@Controller('aspects')
export class AspectsController {
  constructor(private readonly activitiesService: AspectsService) {}

  @ApiOperation({ summary: 'Dane dotyczące wszystkich aktywności' })
  @Get('')
  async all() {
    return await this.activitiesService.allActivities();
  }

  @Post('')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addAspect(@Body() body: AspectDto) {
    return await this.activitiesService.addAspect(body);
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async changeAspect(@Body() body: AspectDto, @Param('id') id: number) {
    return await this.activitiesService.changeAspect(body, id);
  }

  @ApiOperation({ summary: 'Dane dotyczące pojedyńczej aktywności' })
  @Get('/:id')
  async one(@Param('id') id: number) {
    return await this.activitiesService.oneActivity(id);
  }

  @ApiOperation({ summary: 'Dane dotyczące pojedyńczej aktywności' })
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.activitiesService.deleteOneActivity(id);
  }
}
