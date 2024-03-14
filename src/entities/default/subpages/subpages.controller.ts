import { Controller, Get, Param, Req } from '@nestjs/common';
import { SubpagesService } from './subpages.service';
import { Roles } from '../../../auth/guards/roles.decorator';
import { Role } from '../../../auth/guards/role.enum';

@Controller('subpages')
export class SubpagesController {
  constructor(private readonly subpagesService: SubpagesService) {}

  @Get(':id')
  getSubpage(@Req() reg: Request, @Param('id') id: number) {
    this.subpagesService.getSubpage(reg, id);
  }

  @Roles(Role.admin)
  @Get('all')
  getAllSubpage(@Req() reg: Request) {
    this.subpagesService.getAllSubpage(reg);
  }
}
