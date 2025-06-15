import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import { FilmRepository } from '../../repository/film.repository';
import { Order, OrderSchema } from '../schemas/order.schema';
import { FilmModule } from '../../films/modules/films.module';
import { Film, FilmSchema } from '../../films/schemas/film.schema';
import { Film as FilmEntity } from '../../films/entities/films.entity';
import { Schedule as ScheduleEntity } from '../../films/entities/schedule.entity';

@Module({
  imports: [
    FilmModule,
    ConfigModule,
    ...(process.env.DATABASE_DRIVER === 'postgres'
      ? [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])]
      : [
          MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
            { name: Film.name, schema: FilmSchema },
          ]),
        ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, FilmRepository],
  exports: [OrderService],
})
export class OrderModule {}
