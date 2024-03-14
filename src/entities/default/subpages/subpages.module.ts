import { Module } from '@nestjs/common';
import { SubpagesService } from './subpages.service';
import { SubpagesController } from './subpages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubpageEntity } from './entity/subpage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubpageEntity])],
  controllers: [SubpagesController],
  providers: [SubpagesService],
  exports: [TypeOrmModule.forFeature([SubpageEntity])],
})
export class SubpagesModule {}
