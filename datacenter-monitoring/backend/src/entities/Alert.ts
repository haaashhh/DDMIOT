import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Length,
  IsUUID,
} from 'class-validator';
import { Server } from './Server';
import { Rack } from './Rack';

export enum AlertType {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export enum AlertCategory {
  HARDWARE = 'HARDWARE',
  NETWORK = 'NETWORK',
  SECURITY = 'SECURITY',
  ENVIRONMENT = 'ENVIRONMENT',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id!: string;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  @IsEnum(AlertType)
  alert_type!: AlertType;

  @Column({
    type: 'enum',
    enum: AlertCategory,
  })
  @IsEnum(AlertCategory)
  category!: AlertCategory;

  @Column({ length: 200 })
  @IsString()
  @Length(1, 200)
  title!: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Column({ length: 50, nullable: true })
  @IsString()
  @IsOptional()
  server_id?: string;

  @Column({ length: 20, nullable: true })
  @IsString()
  @IsOptional()
  rack_id?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @IsNumber()
  @IsOptional()
  threshold_value?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @IsNumber()
  @IsOptional()
  current_value?: number;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.ACTIVE,
  })
  @IsEnum(AlertStatus)
  @IsOptional()
  status?: AlertStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  resolved_at?: Date;

  @ManyToOne(() => Server, (server) => server.alerts, { nullable: true })
  @JoinColumn({ name: 'server_id' })
  server?: Server;

  @ManyToOne(() => Rack, (rack) => rack.alerts, { nullable: true })
  @JoinColumn({ name: 'rack_id' })
  rack?: Rack;
}