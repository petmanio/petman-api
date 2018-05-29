import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { State } from './state.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 30 })
  name: string;

  @ManyToOne(() => State, state => state.id)
  @JoinColumn({ name: 'state_id' })
  state: State;
}
