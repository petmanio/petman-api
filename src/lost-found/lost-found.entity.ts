import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { LostFoundType } from '@petmanio/common/enum';

import { User } from '../user/user.entity';

@Entity()
export class LostFound {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'enum', enum: LostFoundType })
  type: LostFoundType;

  @Column('text')
  description: string;

  @Column('simple-array')
  images: string[];

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

}
