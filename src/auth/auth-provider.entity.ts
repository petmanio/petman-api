import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AuthProviderType } from '@petman/common';

import { User } from '../user/user.entity';

@Entity()
export class AuthProvider {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'external_id', unique: true })
  externalId: string;

  @Column({ type: 'varchar' })
  type: AuthProviderType;

  @Column({ name: 'access_token' })
  accessToken: string;

  @ManyToOne(() => User, user => user.authProviders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}
