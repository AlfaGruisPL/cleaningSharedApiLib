import { Module } from '@nestjs/common';
import { WallpapersService } from './wallpapers.service';
import { WallpapersController } from './wallpapers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallpaper } from './entities/wallpaper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallpaper])],
  controllers: [WallpapersController],
  providers: [WallpapersService],
  exports: [TypeOrmModule.forFeature([Wallpaper])],
})
export class WallpapersModule {}
