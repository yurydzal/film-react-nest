import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import { FilmRepository } from '../../repository/film.repository';
import { Order, OrderSchema } from '../schemas/order.schema';
import { FilmModule } from '../../films/modules/films.module';
import { Film, FilmSchema } from '../../films/schemas/film.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Film.name, schema: FilmSchema },
    ]),
    FilmModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, FilmRepository],
  exports: [OrderService],
})
export class OrderModule {}
