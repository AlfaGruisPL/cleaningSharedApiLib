import { Controller, Get } from '@nestjs/common';
import { AdminPanelService } from './admin-panel.service';
import { Roles } from '../../auth/guards/roles.decorator';
import { Role } from '../../auth/guards/role.enum';

@Controller('admin-panel')
export class AdminPanelController {
  constructor(private readonly adminPanelService: AdminPanelService) {}

  @Roles(Role.admin)
  @Get('/defaultData')
  activeUserCity() {
    return this.adminPanelService.defaultData();
  }
}
