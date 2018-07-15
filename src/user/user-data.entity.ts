import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Gender } from '@petman/common';

@Entity()
export class UserData {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  facebookUrl: string;

  @Column({ nullable: true })
  messengerUrl: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

}
