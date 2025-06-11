import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsController } from '../controllers/films.controller';
import { FilmsService } from '../services/films.service';
import { FilmRepository } from '../../repository/film.repository';
import { Film, FilmSchema } from '../schemas/film.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmRepository],
  exports: [FilmsService, FilmRepository],
})
export class FilmModule {}
