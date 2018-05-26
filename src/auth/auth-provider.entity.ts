import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsEnum } from 'class-validator';

import { AuthProviderType, Gender } from '../../common/enum';

@Entity()
export class AuthProvider {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'external_id', unique: true })
  externalId: string;

  @IsEnum(Gender)
  @Column({ type: 'enum', enum: AuthProviderType })
  type: AuthProviderType;

  @Column({ name: 'access_token' })
  accessToken: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;

}
