import { Injectable } from '@nestjs/common';
import { FilmRepository } from '../../repository/film.repository';
import { CreateOrderDto } from '../dto/order.dto';
import { OrderResult } from '../interfaces/order.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    private readonly filmRepository: FilmRepository,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
  ): Promise<{ total: number; items: OrderResult[] }> {
    const { tickets } = createOrderDto;
    const orderResults: OrderResult[] = [];

    for (const ticket of tickets) {
      try {
        const existingOrder = await this.orderModel.findOne({
          film: ticket.film,
          session: ticket.session,
          daytime: ticket.daytime,
          row: ticket.row,
          seat: ticket.seat,
        });

        const schedules = await this.filmRepository.findScheduleById(
          ticket.film,
        );
        const session = schedules.find((s) => s.id === ticket.session);
        const seatString = `${ticket.row}:${ticket.seat}`;

        if (existingOrder || (session && session.taken.includes(seatString))) {
          orderResults.push({
            ...ticket,
            id: uuidv4(),
            status: 'rejected',
            message: 'Место уже занято',
          });
          continue;
        }

        await this.filmRepository.updateTakenSeats(
          ticket.film,
          ticket.session,
          seatString,
        );

        const order = new this.orderModel(ticket);
        await order.save();

        orderResults.push({
          ...ticket,
          id: order._id.toString(),
          status: 'confirmed',
        });
      } catch (error) {
        orderResults.push({
          ...ticket,
          id: uuidv4(),
          status: 'rejected',
          message: 'Ошибка при создании заказа',
        });
      }
    }

    return {
      total: orderResults.length,
      items: orderResults,
    };
  }
}
