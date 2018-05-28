import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Shelter {
  @PrimaryGeneratedColumn() id: number;

  @Column('text')
  description: string;

  // TODO: without nullable
  @Column({ type: 'float', nullable: true })
  price: number;

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
