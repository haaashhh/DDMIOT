import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsIP,
  IsArray,
  Length,
} from 'class-validator';
import { Rack } from './Rack';

export enum NetworkDeviceType {
  SWITCH = 'switch',
  ROUTER = 'router',
  FIREWALL = 'firewall',
}

@Entity('network_devices')
export class NetworkDevice {
  @PrimaryColumn({ length: 50 })
  @IsString()
  @Length(1, 50)
  id!: string;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  name!: string;

  @Column({
    type: 'enum',
    enum: NetworkDeviceType,
  })
  @IsEnum(NetworkDeviceType)
  device_type!: NetworkDeviceType;

  @Column({ length: 50, nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  brand?: string;

  @Column({ length: 100, nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  model?: string;

  @Column({ length: 20, nullable: true })
  @IsString()
  @IsOptional()
  rack_id?: string;

  @Column({ type: 'inet', nullable: true })
  @IsIP()
  @IsOptional()
  management_ip?: string;

  @Column({ type: 'integer', nullable: true })
  @IsNumber()
  @IsOptional()
  ports_total?: number;

  @Column({ type: 'integer', default: 0 })
  @IsNumber()
  @IsOptional()
  ports_used?: number;

  @Column({ type: 'integer', array: true, nullable: true })
  @IsArray()
  @IsOptional()
  vlans?: number[];

  @Column({ length: 20, default: 'active' })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  status?: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Rack, (rack) => rack.network_devices, { nullable: true })
  @JoinColumn({ name: 'rack_id' })
  rack?: Rack;
}