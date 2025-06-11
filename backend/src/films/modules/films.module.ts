import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { FilmsController } from '../controllers/films.controller';
import { FilmsService } from '../services/films.service';
import { FilmRepository } from '../../repository/film.repository';
import { Film, FilmSchema } from '../schemas/film.schema';
import { Film as FilmEntity } from '../entities/films.entity';
import { Schedule as ScheduleEntity } from '../entities/schedule.entity';

@Module({
  imports: [
    ConfigModule,
    ...(process.env.DATABASE_DRIVER === 'postgres'
      ? [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])]
      : [MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmRepository],
  exports: [FilmsService, FilmRepository],
})
export class FilmModule {}
