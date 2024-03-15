import { Module } from '@nestjs/common';
import { UsersModule } from './default/users/users.module';
import { TokensModule } from './default/tokens/tokens.module';
import { WallpapersModule } from './wallpapers/wallpapers.module';

@Module({
  imports: [UsersModule, TokensModule, WallpapersModule],
  controllers: [],
  exports: [UsersModule, TokensModule],
})
export class DefaultEntitiesModule {}
