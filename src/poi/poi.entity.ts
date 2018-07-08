import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../user/user.entity';
import { Address } from '../shared/address.entity';
import { Category } from '../shared/category.entity';

@Entity()
export class Poi {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 150 })
  avatar: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @ManyToOne(() => Address, address => address.id)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, category => category.id)
  @JoinColumn({ name: 'primary_category_id' })
  primaryCategory: Category;

  @ManyToOne(type => Poi, poi => poi.branches)
  @JoinColumn({ name: 'main_id' })
  main: Poi;

  @OneToMany(type => Poi, poi => poi.main)
  branches: Poi[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}
