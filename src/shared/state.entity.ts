import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Country } from './country.entity';
import { City } from './city.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 30 })
  name: string;

  @OneToMany(() => City, city => city.state)
  cities: City[];

  @ManyToOne(() => Country, country => country.id)
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
