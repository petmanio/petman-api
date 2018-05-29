import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 150 })
  title: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted: Date;
}
