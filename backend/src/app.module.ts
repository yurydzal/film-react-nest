import { Module } from '@nestjs/common';
import {ServeStaticModule} from "@nestjs/serve-static";
import {ConfigModule} from "@nestjs/config";
import * as path from "node:path";

<<<<<<< Updated upstream
import {configProvider} from "./app.config.provider";

@Module({
  imports: [
	ConfigModule.forRoot({
          isGlobal: true,
          cache: true
      }),
      // @todo: Добавьте раздачу статических файлов из public
=======
import { configProvider } from './app.config.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmModule } from './films/modules/films.module';
import { OrderModule } from './order/modules/order.module';
import { Film as FilmEntity } from './films/entities/films.entity';
import { Schedule as ScheduleEntity } from './films/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      renderPath: 'content/afisha/',
    }),
    process.env.DATABASE_DRIVER === 'mongodb'
      ? MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('DATABASE_URL'),
          }),
          inject: [ConfigService],
        })
      : TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            return {
              type: 'postgres',
              host: configService.get<string>('DATABASE_HOST'),
              port: configService.get<number>('DATABASE_PORT'),
              username: configService.get<string>('DATABASE_USERNAME'),
              password: configService.get<string>('DATABASE_PASSWORD'),
              database: configService.get<string>('DATABASE_NAME'),
              entities: [FilmEntity, ScheduleEntity],
              synchronize: false,
            };
          },
          inject: [ConfigService],
        }),
    FilmModule,
    OrderModule,
>>>>>>> Stashed changes
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
