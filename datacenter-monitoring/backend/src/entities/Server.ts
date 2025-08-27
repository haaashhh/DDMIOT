import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsIP,
  Length,
  IsMACAddress,
} from 'class-validator';
import { Rack } from './Rack';
import { Alert } from './Alert';

export enum ServerStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
  OFFLINE = 'offline',
}

@Entity('servers')
export class Server {
  @PrimaryColumn({ length: 50 })
  @IsString()
  @Length(1, 50)
  id!: string;

  @Column({ length: 100 })
  @IsString()
  @Length(1, 100)
  name!: string;

  @Column({ length: 20 })
  @IsString()
  rack_id!: string;

  @Column({ length: 10, nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 10)
  position?: string;

  @Column({ length: 50, nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  server_type?: string;

  @Column({ length: 100, nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  operating_system?: string;

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

  @Column({ length: 200, nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 200)
  cpu_specs?: string;

  @Column({ length: 100, nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  memory_specs?: string;

  @Column({ length: 200, nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 200)
  storage_specs?: string;

  @Column({ type: 'inet', nullable: true })
  @IsIP()
  @IsOptional()
  ip_address?: string;

  @Column({ type: 'macaddr', nullable: true })
  @IsMACAddress()
  @IsOptional()
  mac_address?: string;

  @Column({ type: 'integer', nullable: true })
  @IsNumber()
  @IsOptional()
  vlan_id?: number;

  @Column({
    type: 'enum',
    enum: ServerStatus,
    default: ServerStatus.ACTIVE,
  })
  @IsEnum(ServerStatus)
  @IsOptional()
  status?: ServerStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 25.0 })
  @IsNumber()
  @IsOptional()
  cpu_baseline?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 65.0 })
  @IsNumber()
  @IsOptional()
  memory_baseline?: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, default: 35.0 })
  @IsNumber()
  @IsOptional()
  temp_idle?: number;

  @Column({ type: 'integer', default: 180 })
  @IsNumber()
  @IsOptional()
  power_idle?: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Rack, (rack) => rack.servers)
  @JoinColumn({ name: 'rack_id' })
  rack!: Rack;

  @OneToMany(() => Alert, (alert) => alert.server)
  alerts!: Alert[];
}