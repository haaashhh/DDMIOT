import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsNumber, IsOptional, Length } from 'class-validator';
import { Server } from './Server';
import { NetworkDevice } from './NetworkDevice';
import { Alert } from './Alert';

@Entity('racks')
export class Rack {
  @PrimaryColumn({ length: 20 })
  @IsString()
  @Length(1, 20)
  id!: string;

  @Column({ length: 10 })
  @IsString()
  @Length(1, 10)
  zone!: string;

  @Column({ type: 'integer' })
  @IsNumber()
  position!: number;

  @Column({ length: 10, default: '42U' })
  @IsString()
  @IsOptional()
  @Length(1, 10)
  height?: string;

  @Column({ type: 'integer', nullable: true })
  @IsNumber()
  @IsOptional()
  power_capacity?: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @Column({ type: 'integer', default: 0 })
  @IsNumber()
  @IsOptional()
  servers_count?: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => Server, (server) => server.rack)
  servers!: Server[];

  @OneToMany(() => NetworkDevice, (device) => device.rack)
  network_devices!: NetworkDevice[];

  @OneToMany(() => Alert, (alert) => alert.rack)
  alerts!: Alert[];
}