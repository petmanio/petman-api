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
import { IsEmail } from 'class-validator';

import { AuthProvider } from '../auth/auth-provider.entity';
import { UserData } from './user-data.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(type => UserData)
  @JoinColumn({ name: 'user_data_id' })
  userData: UserData;

  @OneToMany(() => AuthProvider, authProvider => authProvider.id)
  authProviders: AuthProvider[];

  @ManyToMany(type => User)
  @JoinTable()
  businessUsers: User[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

}
