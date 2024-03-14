import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { DefaultEntitiesModule } from './entities/defaultEntities.module';
import { TokensService } from './entities/default/tokens/tokens.service';
import { WebsiteDataModule } from './entities/default/website-data/website-data.module';
import { SubpagesModule } from './entities/default/subpages/subpages.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './entities/default/files/files.module';
import { VisitsModule } from './modules/visits/visits.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { EmailsModule } from './modules/emails/emails.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    DefaultEntitiesModule,
    VisitsModule,
    WebsiteDataModule,
    SubpagesModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    FilesModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CronService,
    TokensService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
