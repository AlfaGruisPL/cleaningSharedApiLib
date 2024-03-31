import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/default/users/entities/user.entity';
import { Login201Dto } from '../dto/login-201.dto';
import { ExtendedException, ExtendedExceptionEnum } from '../ExtendedException';
import { TokensService } from '../../entities/default/tokens/tokens.service';
import { Request } from 'express';
import { EmailsService } from '../../modules/emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private email_: EmailsService,
    private tokenService: TokensService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  public async login(req: Request, body: LoginDto): Promise<Login201Dto> {
    //sprawdzenie użytkownika po emailu
    var email = body.email.trim();
    const users = await this.usersRepository.find({
      select: {
        id: true,
        salt: true,
      },
      where: {
        email: email,
      },
    });
    if (users.length == 0)
      throw new ExtendedException(ExtendedExceptionEnum.userLoginNoFind);
    if (users.length > 1)
      throw new ExtendedException(ExtendedExceptionEnum.userLoginToMuch);
    //przygotowanie hasła
    const password = body.password.trim();
    var sha256 = require('js-sha256');
    // const passwordHash = sha256(process.env.SALT + password + users[0].salt);
    const passwordHash = password;
    // pobranie użytkownika z loginem i hasłem
    let userWithPassword: UserEntity;
    try {
      userWithPassword = await this.usersRepository.findOneOrFail({
        where: {
          email: email,
          password: passwordHash,
        },
        relations: {
          userInGroups: {
            group: true,
          },
        },
      });
    } catch (error) {
      if (users.length > 0)
        throw new ExtendedException(
          ExtendedExceptionEnum.userLogin_noUserFound,
        );
    }
    userWithPassword.userInGroups.forEach((userInGroup) => {
      userInGroup['name'] = userInGroup.group.name;
      delete userInGroup.id;
      userInGroup['id'] = userInGroup.group.id;
      delete userInGroup.group;
    });
    const tokenRecord = await this.tokenService.addTokenToDB(userWithPassword);
    const tokenRecord_Refresh = await this.tokenService.addTokenToDB(
      userWithPassword,
      true,
    );
    const payload = {
      userId: userWithPassword.id,
      username: body.email,
      group: userWithPassword.userInGroups,
      tokenId: tokenRecord.id,
    };
    const token = await this.jwtService.signAsync(payload);
    const refreshToken = this.jwtService.sign(
      { tokenId: tokenRecord_Refresh.id },
      { expiresIn: '31d' },
    );
    return { token: token, refresh_token: refreshToken };
  }

  async refreshToken(req) {
    const refreshToken2 = this.extractTokenFromHeader(req);
    try {
      const payload = (await this.jwtService.verifyAsync(refreshToken2, {
        secret: process.env.JWT_SECRET,
      })) as { tokenId: number };
      //    console.log('refresh payload: ', payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      if (!(await this.tokenService.checkTokenActive(payload.tokenId))) {
        //      console.log('GUARD JTW refresh no token in db');
        throw new UnauthorizedException();
      }

      const [user, tokenId] = await this.tokenService.addTokenToDBByTokenId(
        payload.tokenId,
      );
      const [user2, tokenRefreshId] =
        await this.tokenService.addTokenToDBByTokenId(payload.tokenId, true);
      //    console.log('GUARD JTW refresh OK');

      const payload2 = {
        userId: user.id,
        username: user.email,
        group: user.userInGroups,
        tokenId: tokenId,
      };
      const token = await this.jwtService.signAsync(payload2);
      const refreshToken = this.jwtService.sign(
        { tokenId: tokenRefreshId },
        { expiresIn: '31d' },
      );
      return { token: token, refresh_token: refreshToken };
    } catch (error) {
      //   console.log('GUARD JTW  refresh NO OK', error);
      throw new UnauthorizedException();
    }
  }

  async sendResetEmail(req, body: { email: string }) {
    const user = await this.usersRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new ExtendedException(ExtendedExceptionEnum.userLogin_noUserFound);
    }
    const random =
      Math.round(Math.random() * 9999999).toString() +
      new Date().getTime().toString() +
      '1' +
      Math.round(Math.random() * 9999999).toString() +
      '_' +
      new Date().getTime().toString();
    user.resetPasswordCode = random;
    await this.usersRepository.save(user);
    const link = `https://foundation.mojzaklad.pl/authorization/resetPassword?code=${random}`;
    await this.email_.SendResetPassword(link, user.email);
  }

  async resetPassword(req, code: string) {
    //todo doać sprawdzanie czasu czy nie minęło za dużo cza jest po znaku _
    if (!code || code.length < 10) {
      throw new BadRequestException();
    }
    const user = await this.usersRepository.findOne({
      where: {
        resetPasswordCode: code,
      },
    });
    if (!user) {
      throw new ExtendedException(ExtendedExceptionEnum.userLogin_noUserFound);
    }
    const random = Math.round(Math.random() * 9999999).toString();
    var sha256 = require('js-sha256');
    // const passwordHash = sha256(process.env.SALT + password + users[0].salt);
    const passwordHash = random;
    user.password = passwordHash;
    user.resetPasswordCode = '';
    await this.usersRepository.save(user);
    return 'New password: ' + passwordHash;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
