import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../../../auth/guards/roles.decorator';
import { Role } from '../../../auth/guards/role.enum';
import { AddUserDto } from './dto/AddUser.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.admin)
  @Get('list')
  async getUserList(@Req() reg: Request) {
    return await this.usersService.getUserList(reg);
  }

  @Roles(Role.admin)
  @Post('')
  async addUser(@Req() reg: Request, @Body() body: AddUserDto) {
    return await this.usersService.addUser(reg, body);
  }

  @Roles(Role.admin)
  @Delete(':id')
  async deleteUser(@Req() reg: Request, @Param('id') id: number) {
    return await this.usersService.deleteUser(reg, id);
  }

  @Roles(Role.admin)
  @Patch(':id')
  async PatchUser(
    @Req() reg: Request,
    @Body() body: AddUserDto,
    @Param('id') id: number,
  ) {
    return await this.usersService.patchUser(reg, id, body);
  }
}
