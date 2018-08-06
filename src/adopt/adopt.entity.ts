import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Gender, PetSize, PetType, PetAge } from '@petman/common';

import { User } from '../user/user.entity';

@Entity()
export class Adopt {
  @PrimaryGeneratedColumn() id: number;

  @Column('text') description: string;

  @Column('simple-array') images: string[];

  @Index()
  @Column({ type: 'varchar', nullable: true })
  type: PetType;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  gender: Gender;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  size: PetSize;

  @Column({ type: 'varchar', nullable: true })
  age: PetAge;

  // @ManyToOne(() => Address, address => address.id)
  // @JoinColumn({ name: 'address_id' })
  // address: Address;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}
