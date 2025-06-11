import { Injectable } from '@nestjs/common';
import { FilmRepository } from '../../repository/film.repository';
import { Film } from '../interfaces/film.interface';
import { Schedule } from '../interfaces/schedule.interface';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async getAllFilms(): Promise<{ total: number; items: Film[] }> {
    const films = await this.filmRepository.findAll();
    return {
      total: films.length,
      items: films,
    };
  }

  async getFilmSchedule(
    filmId: string,
  ): Promise<{ total: number; items: Schedule[] }> {
    const schedules = await this.filmRepository.findScheduleById(filmId);
    return {
      total: schedules.length,
      items: schedules,
    };
  }
}
