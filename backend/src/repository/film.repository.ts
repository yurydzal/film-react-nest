import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/schemas/film.schema';
import { Schedule } from '../films/interfaces/schedule.interface';

@Injectable()
export class FilmRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findScheduleById(filmId: string): Promise<Schedule[]> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    return film?.schedule || [];
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
        },
        {
          $push: {
            'schedule.$.taken': seat,
          },
        },
      )
      .exec();
  }
}
