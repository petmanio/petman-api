import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AuthProvider } from '../auth/auth-provider.entity';
import { UserData } from './user-data.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(type => UserData)
  @JoinColumn({ name: 'user_data_id' })
  userData: UserData;

  @OneToMany(() => AuthProvider, authProvider => authProvider.user)
  authProviders: AuthProvider[];

  @ManyToMany(type => User)
  @JoinTable()
  businessUsers: User[];

  @Column({ name: 'is_sitter', type: 'boolean', nullable: true })
  isSitter: boolean;

  @Column({ name: 'is_walker', type: 'boolean', nullable: true })
  isWalker: boolean;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}
