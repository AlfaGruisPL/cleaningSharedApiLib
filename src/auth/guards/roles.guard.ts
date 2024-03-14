import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TokensService } from '../../entities/default/tokens/tokens.service';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

import { Request } from 'express';

export interface jwtPayload {
  userId: number;
  username: string;
  group: [any];
  tokenId: number;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private tokenService: TokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      //console.log(2);
      throw new UnauthorizedException();
    }
    // console.log(3);
    try {
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })) as jwtPayload;
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      if (!(await this.tokenService.checkTokenActive(payload.tokenId))) {
        //  console.log('GUARD JTW no token i db');
        throw new UnauthorizedException();
      }
      //    console.log('GUARD JTW OK');
    } catch (error) {
      // console.log('GUARD JTW NO OK');
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
