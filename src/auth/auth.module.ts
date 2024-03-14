import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { UsersModule } from '../entities/default/users/users.module';
import { TokensModule } from '../entities/default/tokens/tokens.module';
import { EmailsModule } from '../modules/emails/emails.module';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    EmailsModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
