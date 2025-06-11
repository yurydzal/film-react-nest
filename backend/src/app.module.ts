import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';

import { MongooseModule } from '@nestjs/mongoose';

import { FilmModule } from './films/modules/films.module';
import { OrderModule } from './order/modules/order.module';

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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    FilmModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
