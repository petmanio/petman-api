import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Gender } from '../../common/enum';
import { IsEnum } from 'class-validator';

@Entity()
export class UserData {
  @PrimaryGeneratedColumn() id: number;

  @IsEnum(Gender)
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

}
