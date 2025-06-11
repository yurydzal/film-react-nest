import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsNumber } from 'class-validator';
import { Film } from './films.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  @IsString()
  daytime: string;

  @Column()
  @IsNumber()
  hall: number;

  @Column()
  @IsNumber()
  rows: number;

  @Column()
  @IsNumber()
  seats: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNumber()
  price: number;

  @Column('text', { default: '' })
  taken: string;

  @Column('uuid')
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedule, {
    cascade: true,
  })
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
