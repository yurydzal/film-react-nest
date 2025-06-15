import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { IsString, IsNumber } from 'class-validator';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn('uuid')
  id: string;

  @Column('numeric', { precision: 3, scale: 1 })
  @IsNumber()
  rating: number;

  @Column()
  @IsString()
  director: string;

  @Column('text')
  tags: string;

  @Column()
  @IsString()
  image: string;

  @Column()
  @IsString()
  cover: string;

  @Column()
  @IsString()
  title: string;

  @Column()
  @IsString()
  about: string;

  @Column()
  @IsString()
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedule: Schedule[];
}
