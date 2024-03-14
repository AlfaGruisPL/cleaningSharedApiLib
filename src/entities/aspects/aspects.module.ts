import { Module } from '@nestjs/common';
import { AspectsService } from './aspects.service';
import { AspectsController } from './aspects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AspectEntity } from './entity/aspect.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AspectEntity])],
  controllers: [AspectsController],
  providers: [AspectsService],
  exports: [TypeOrmModule.forFeature([AspectEntity])],
})
export class AspectsModule {}
