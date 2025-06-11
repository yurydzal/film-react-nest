import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../../films/schemas/film.schema';
import { Order } from '../schemas/order.schema';
import { CreateOrderDto } from '../dto/order.dto';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film as FilmEntity } from '../../films/entities/films.entity';
import { Schedule as ScheduleEntity } from '../../films/entities/schedule.entity';

@Injectable()
export class OrderService {
  private isPostgres: boolean;

  constructor(
    private configService: ConfigService,
    @Optional()
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    @Optional()
    @InjectModel(Film.name)
    private filmModel: Model<Film>,
    @Optional()
    @InjectRepository(FilmEntity)
    private filmEntityRepository: Repository<FilmEntity>,
    @Optional()
    @InjectRepository(ScheduleEntity)
    private scheduleEntityRepository: Repository<ScheduleEntity>,
  ) {
    this.isPostgres = this.configService.get('DATABASE_DRIVER') === 'postgres';
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const orderResults = [];

    for (const ticket of createOrderDto.tickets) {
      const seatString = `${ticket.row}:${ticket.seat}`;

      if (this.isPostgres) {
        const film = await this.filmEntityRepository.findOne({
          where: { id: ticket.film },
          relations: ['schedule'],
        });

        if (film) {
          const schedule = film.schedule.find((s) => s.id === ticket.session);
          if (schedule) {
            const currentTaken =
              typeof schedule.taken === 'string'
                ? schedule.taken.split(',').filter((s) => s.trim())
                : schedule.taken || [];
            currentTaken.push(seatString);
            schedule.taken = currentTaken.join(',');
            await this.filmEntityRepository.save(film);
          }
        }
      } else {
        const film = await this.filmModel.findOne({ id: ticket.film }).exec();
        if (film) {
          const session = film.schedule.find((s) => s.id === ticket.session);
          if (session) {
            session.taken.push(seatString);
            await film.save();
          }
        }
      }

      orderResults.push({
        ...ticket,
        id: uuidv4(),
      });
    }

    return { total: orderResults.length, items: orderResults };
  }
}
