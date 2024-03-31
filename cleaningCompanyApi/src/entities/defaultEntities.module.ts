import { Module } from '@nestjs/common';
import { UsersModule } from './default/users/users.module';
import { TokensModule } from './default/tokens/tokens.module';

@Module({
  imports: [UsersModule, TokensModule],
  controllers: [],
  exports: [UsersModule, TokensModule],
})
export class DefaultEntitiesModule {}
