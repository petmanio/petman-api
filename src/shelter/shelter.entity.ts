import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Shelter {
  @PrimaryGeneratedColumn() id: number;

  @Column('text')
  description: string;

  @Column('float')
  price: number;

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => User, user => user.id)
  user: User[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

}
