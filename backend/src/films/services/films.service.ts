import { Injectable } from '@nestjs/common';
import { FilmRepository } from '../../repository/film.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmRepository: FilmRepository) {}

  async getAllFilms() {
    return await this.filmRepository.findAll();
  }

  async getFilmSchedule(filmId: string) {
    return await this.filmRepository.findScheduleById(filmId);
  }
}
