import { Module } from '@nestjs/common';
import { WebsiteDataService } from './website-data.service';
import { WebsiteDataController } from './website-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteDataEntity } from './entities/websiteData.entity';
import { EmailsModule } from '../../../modules/emails/emails.module';

@Module({
  imports: [TypeOrmModule.forFeature([WebsiteDataEntity]), EmailsModule],
  controllers: [WebsiteDataController],
  providers: [WebsiteDataService],
  exports: [TypeOrmModule.forFeature([WebsiteDataEntity])],
})
export class WebsiteDataModule {}
