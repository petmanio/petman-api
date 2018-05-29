import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Address } from '../shared/address.entity';
import { Service } from '../service/service.entity';
import { Branch } from './branch.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array')
  images: string[];

  @OneToOne(type => Address, { nullable: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(type => Service)
  @JoinTable()
  services: Service[];

  @OneToMany(() => Branch, branch => branch.organization)
  branches: Branch[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}
