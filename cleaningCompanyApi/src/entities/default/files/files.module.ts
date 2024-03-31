import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entity/file.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.register({ dest: 'assets/files' }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [TypeOrmModule.forFeature([FileEntity]), FilesService],
})
export class FilesModule {}
