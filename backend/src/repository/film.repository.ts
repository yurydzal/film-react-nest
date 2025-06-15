import { Injectable, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Film as FilmSchema } from '../films/schemas/film.schema';
import { Film as FilmEntity } from '../films/entities/films.entity';
import { Schedule as ScheduleEntity } from '../films/entities/schedule.entity';

@Injectable()
export class FilmRepository {
  private isPostgres: boolean;

  constructor(
    private configService: ConfigService,
    @Optional()
    @InjectModel(FilmSchema.name)
    private filmModel: Model<FilmSchema>,
    @Optional()
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
    @Optional()
    @InjectRepository(ScheduleEntity)
    private scheduleRepository: Repository<ScheduleEntity>,
  ) {
    this.isPostgres = this.configService.get('DATABASE_DRIVER') === 'postgres';
  }

  async findAll() {
    if (this.isPostgres) {
      const [total, items] = await Promise.all([
        this.filmRepository.count(),
        this.filmRepository.find({
          relations: {
            schedule: true,
          },
        }),
      ]);
      return {
        total,
        items,
      };
    } else {
      const films = await this.filmModel.find().exec();
      return {
        total: films.length,
        items: films,
      };
    }
  }

  async findScheduleById(filmId: string) {
    if (this.isPostgres) {
      const film = await this.filmRepository.findOne({
        where: { id: filmId },
        relations: ['schedule'],
      });
      return film?.schedule || [];
    } else {
      const film = await this.filmModel.findOne({ id: filmId }).exec();
      const schedules = film?.schedule || [];
      return {
        total: schedules.length,
        items: schedules,
      };
    }
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<void> {
    if (this.isPostgres) {
      const schedule = await this.scheduleRepository.findOne({
        where: { id: sessionId, filmId: filmId },
      });
      if (schedule) {
        const currentTaken = schedule.taken
          ? schedule.taken.split(',').filter((s) => s.trim())
          : [];
        currentTaken.push(seat);
        schedule.taken = currentTaken.join(',');
        await this.scheduleRepository.save(schedule);
      }
    } else {
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
}
