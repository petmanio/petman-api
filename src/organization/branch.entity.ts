import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Address } from '../shared/address.entity';
import { Service } from '../service/service.entity';
import { Organization } from './organization.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array')
  images: string[];

  @Column({ type: 'boolean', default: 'false' })
  main: boolean;

  @ManyToOne(() => Address, address => address.id)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @ManyToMany(type => Service)
  @JoinTable()
  services: Service[];

  @ManyToOne(() => Organization, organization => organization.id)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}
