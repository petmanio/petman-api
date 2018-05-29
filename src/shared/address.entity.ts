import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Point } from '@petmanio/common/interface';

import { City } from './city.entity';
import { State } from './state.entity';
import { Country } from './country.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'line_1' })
  line1: string;

  @Column({ name: 'line_2', nullable: true })
  line2: string;

  @Column({ name: 'line_3', nullable: true })
  line3: string;

  @Column({ type: 'point', nullable: true })
  point: Point;

  @OneToOne(type => City)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToOne(type => State)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @OneToOne(type => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}
