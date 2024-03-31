import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { ApiDefaultResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Login201Dto } from '../dto/login-201.dto';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../guards/role.enum';

@Controller('authorization')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'Login success.',
  })
  @ApiOperation({ summary: 'Login to api, return JWT token.' })
  @ApiDefaultResponse({ type: Login201Dto })
  @ApiResponse({ status: 400, description: 'No good data.' })
  //@ApiQuery({ type: LoginDto })
  @Post('/login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Req() req, @Body() body: LoginDto) {
    return this.service.login(req, body);
  }

  @Roles(Role.admin)
  @Get('profile')
  getProfile(@Req() req) {
    return 123;
  }

  @Get('refresh')
  refreshToken(@Req() req) {
    return this.service.refreshToken(req);
  }

  @Post('sendResetEmail')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  sendResetEmail(@Req() req, @Body() body: { email: string }) {
    return this.service.sendResetEmail(req, body);
  }

  @Get('resetPassword')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  resetPassword(@Req() req, @Query('code') code: string) {
    return this.service.resetPassword(req, code);
  }
}
