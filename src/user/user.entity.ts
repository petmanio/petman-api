import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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
  businessUsers: User[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

}
