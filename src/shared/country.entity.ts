import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { State } from './state.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 3 })
  sortname: string;

  @Column('integer')
  phonecode: number;

  @OneToMany(() => State, state => state.country)
  states: State[];
}
