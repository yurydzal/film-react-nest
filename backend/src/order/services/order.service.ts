import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from '../dto/order.dto';
import { v4 as uuidv4 } from 'uuid';
import { FilmRepository } from '../../repository/film.repository';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private configService: ConfigService,
    private filmRepository: FilmRepository,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const orderResults = [];

    try {
      for (const ticket of createOrderDto.tickets) {
        const seatString = `${ticket.row}:${ticket.seat}`;

        await this.filmRepository.updateTakenSeats(
          ticket.film,
          ticket.session,
          seatString,
        );

        orderResults.push({
          ...ticket,
          id: uuidv4(),
          status: 'confirmed',
        });
      }

      return {
        total: orderResults.length,
        items: orderResults,
      };
    } catch (error) {
      this.logger.error(`Failed to create order: ${error.message}`);
      throw error;
    }
  }
}
