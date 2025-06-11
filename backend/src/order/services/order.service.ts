// import { Injectable, Optional } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Model } from 'mongoose';
// import { Repository } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { v4 as uuidv4 } from 'uuid';
// import { FilmRepository } from '../../repository/film.repository';
// import { CreateOrderDto } from '../dto/order.dto';
// import { OrderResult } from '../interfaces/order.interface';
// import { Order } from '../schemas/order.schema';
// import { Film as FilmEntity } from '../../films/entities/films.entity';

// @Injectable()
// export class OrderService {
//   private isPostgres: boolean;
//   constructor(
//     private readonly filmRepository: FilmRepository,
//     private configService: ConfigService,
//     @Optional()
//     @InjectModel(Order.name)
//     private orderModel: Model<Order>,
//     @Optional()
//     @InjectRepository(FilmEntity)
//     private orderRepository: Repository<FilmEntity>,
//   ) {
//     this.isPostgres = this.configService.get('DATABASE_DRIVER') === 'postgres';
//   }

//   async createOrder(
//     createOrderDto: CreateOrderDto,
//   ): Promise<{ total: number; items: OrderResult[] }> {
//     const { tickets } = createOrderDto;
//     const orderResults: OrderResult[] = [];

//     for (const ticket of tickets) {
//       try {
//         const existingOrder = await this.orderModel.findOne({
//           film: ticket.film,
//           session: ticket.session,
//           daytime: ticket.daytime,
//           row: ticket.row,
//           seat: ticket.seat,
//         });
//         const schedulesResponse = await this.filmRepository.findScheduleById(
//           ticket.film,
//         );
//         const schedules = Array.isArray(schedulesResponse)
//           ? schedulesResponse
//           : schedulesResponse.items;
//         const session = schedules.find((s) => s.id === ticket.session);
//         const seatString = `${ticket.row}:${ticket.seat}`;

//         if (existingOrder || (session && session.taken.includes(seatString))) {
//           orderResults.push({
//             ...ticket,
//             id: uuidv4(),
//             status: 'rejected',
//             message: 'Место уже занято',
//           });
//           continue;
//         }

//         await this.filmRepository.updateTakenSeats(
//           ticket.film,
//           ticket.session,
//           seatString,
//         );

//         const order = new this.orderModel(ticket);
//         await order.save();

//         orderResults.push({
//           ...ticket,
//           id: order._id.toString(),
//           status: 'confirmed',
//         });
//       } catch (error) {
//         orderResults.push({
//           ...ticket,
//           id: uuidv4(),
//           status: 'rejected',
//           message: `Ошибка при создании заказа ${error.message}`,
//         });
//       }
//     }

//     return {
//       total: orderResults.length,
//       items: orderResults,
//     };
//   }
// }

// import { Injectable, Optional } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Model } from 'mongoose';
// import { DeepPartial, Repository } from 'typeorm';
// import { ConfigService } from '@nestjs/config';
// import { v4 as uuidv4 } from 'uuid';

// import { FilmRepository } from '../../repository/film.repository';
// import { CreateOrderDto } from '../dto/order.dto';
// import { OrderResult } from '../interfaces/order.interface';
// import { Order } from '../schemas/order.schema';
// import { Film, Film as FilmEntity } from '../../films/entities/films.entity';

// @Injectable()
// export class OrderService {
//   private isPostgres: boolean;

//   constructor(
//     private readonly filmRepository: FilmRepository,
//     private configService: ConfigService,
//     @Optional()
//     @InjectModel(Order.name)
//     private orderModel: Model<Order>,
//     @Optional()
//     @InjectRepository(FilmEntity)
//     private orderRepository: Repository<FilmEntity>,
//   ) {
//     this.isPostgres = this.configService.get('DATABASE_DRIVER') === 'postgres';
//   }

//   async createOrder(
//     createOrderDto: CreateOrderDto,
//   ): Promise<{ total: number; items: OrderResult[] }> {
//     const { tickets } = createOrderDto;
//     const orderResults: OrderResult[] = [];

//     for (const ticket of tickets) {
//       try {
//         // Check if seat is already taken
//         const existingOrder = this.isPostgres
//           ? await this.orderRepository.findOne({
//               where: {
//                 id: ticket.film,
//               },
//               relations: {
//                 schedule: true,
//               },
//             })
//           : await this.orderModel.findOne({
//               film: ticket.film,
//               session: ticket.session,
//               daytime: ticket.daytime,
//               row: ticket.row,
//               seat: ticket.seat,
//             });

//         const schedulesResponse = await this.filmRepository.findScheduleById(
//           ticket.film,
//         );
//         const schedules = Array.isArray(schedulesResponse)
//           ? schedulesResponse
//           : schedulesResponse.items;
//         const session = schedules.find((s) => s.id === ticket.session);
//         const seatString = `${ticket.row}:${ticket.seat}`;

//         if (existingOrder || (session && session.taken.includes(seatString))) {
//           orderResults.push({
//             ...ticket,
//             id: uuidv4(),
//             status: 'rejected',
//             message: 'Место уже занято',
//           });
//           continue;
//         }

//         await this.filmRepository.updateTakenSeats(
//           ticket.film,
//           ticket.session,
//           seatString,
//         );

//         const orderData = this.isPostgres
//           ? {
//               sessionId: ticket.session,
//               filmId: ticket.film,
//               rowNumber: ticket.row,
//               seatNumber: ticket.seat,
//               daytime: ticket.daytime,
//             }
//           : ticket;

//         const order = this.isPostgres
//           ? await this.orderRepository.save(orderData as DeepPartial<Film>)
//           : await new this.orderModel(orderData).save();

//         orderResults.push({
//           ...ticket,
//           id: (order as OrderDocument)._id.toString(),
//           status: 'confirmed',
//         });
//       } catch (error) {
//         orderResults.push({
//           ...ticket,
//           id: uuidv4(),
//           status: 'rejected',
//           message: 'Ошибка при создании заказа',
//         });
//       }
//     }

//     return {
//       total: orderResults.length,
//       items: orderResults,
//     };
//   }
// }

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
