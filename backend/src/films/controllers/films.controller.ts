import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from '../services/films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmService: FilmsService) {}

  @Get()
  async getFilms() {
    return this.filmService.getAllFilms();
  }

  @Get(':id/schedule')
  async getFilmSchedule(@Param('id') id: string) {
    return this.filmService.getFilmSchedule(id);
  }
}
