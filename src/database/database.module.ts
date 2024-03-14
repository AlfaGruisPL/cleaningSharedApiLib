import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { DataSource } from 'typeorm';

class TypeOrmOptions implements TypeOrmOptionsFactory {
  constructor() /*   @Inject(DatabaseLogger)
       private readonly DatabaseLoggerService: DatabaseLogger,*/ {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../**/*.entity.js'],
      synchronize: true,
      charset: 'utf8mb4',
      /* logger: this.DatabaseLoggerService,*/
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule /*, DatabaseLogger*/],
      //inject: [DatabaseLogger],
      useClass: TypeOrmOptions,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
  controllers: [],
  providers: [
    /*DatabaseLogger*/
  ],
  exports: [TypeOrmModule /*, DatabaseLogger*/],
})
export class DatabaseModule {}
