import {
  Injectable,
  Optional,
  ConflictException,
  Logger,
} from '@nestjs/common';
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
  private readonly logger = new Logger(FilmRepository.name);

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
    try {
      if (this.isPostgres) {
        const query = this.filmRepository
          .createQueryBuilder('film')
          .leftJoinAndSelect('film.schedule', 'schedule')
          .orderBy('film.title', 'ASC')
          .addOrderBy('schedule.daytime', 'ASC');

        const [items, total] = await query.getManyAndCount();

        return {
          total,
          items,
        };
      } else {
        const films = await this.filmModel.find().sort({ title: 1 }).exec();

        return {
          total: films.length,
          items: films,
        };
      }
    } catch (error) {
      this.logger.error('Error finding all films:', error);
      throw error;
    }
  }

  async findScheduleById(filmId: string) {
    try {
      if (this.isPostgres) {
        const schedules = await this.scheduleRepository
          .createQueryBuilder('schedule')
          .where('schedule.filmId = :filmId', { filmId })
          .orderBy('schedule.daytime', 'ASC')
          .getMany();

        return {
          total: schedules.length,
          items: schedules,
        };
      } else {
        const film = await this.filmModel.findOne({ id: filmId }).exec();
        const schedules =
          film?.schedule?.sort(
            (a, b) =>
              new Date(a.daytime).getTime() - new Date(b.daytime).getTime(),
          ) || [];

        return {
          total: schedules.length,
          items: schedules,
        };
      }
    } catch (error) {
      this.logger.error(`Error finding schedule for film ${filmId}:`, error);
      throw error;
    }
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<void> {
    try {
      if (this.isPostgres) {
        await this.scheduleRepository.manager.transaction(async (manager) => {
          const schedule = await manager.findOne(ScheduleEntity, {
            where: { id: sessionId, filmId: filmId },
            lock: { mode: 'pessimistic_write' },
          });

          if (!schedule) {
            throw new Error('Schedule not found');
          }

          const currentTaken = schedule.taken
            ? schedule.taken.split(',').filter((s) => s.trim())
            : [];

          if (currentTaken.includes(seat)) {
            throw new ConflictException('Seat already taken');
          }

          currentTaken.push(seat);
          schedule.taken = currentTaken.join(',');
          await manager.save(ScheduleEntity, schedule);
        });
      } else {
        const existingSeat = await this.filmModel
          .findOne({
            id: filmId,
            'schedule.id': sessionId,
            'schedule.taken': seat,
          })
          .exec();

        if (existingSeat) {
          throw new ConflictException('Seat already taken');
        }

        await this.filmModel
          .updateOne(
            { id: filmId, 'schedule.id': sessionId },
            { $push: { 'schedule.$.taken': seat } },
          )
          .exec();
      }
    } catch (error) {
      this.logger.error(`Failed to update taken seats: ${error.message}`);
      throw error;
    }
  }
}
