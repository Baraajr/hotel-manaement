import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  roomNumber: string;

  @Column({ type: 'varchar', length: 50 })
  roomType: string; // e.g., single, double, suite

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerNight: number;

  @Column({
    type: 'enum',
    enum: ['available', 'occupied', 'under_maintenance'],
    default: 'available',
  })
  status: 'available' | 'occupied' | 'under_maintenance';

  @Column({ type: 'int', nullable: true })
  floor: number;

  @Column({ type: 'int', nullable: true })
  bedCount: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  bedType: string; // single, queen, king, etc.

  @Column({ type: 'jsonb', nullable: true })
  amenities: string[]; // ["wifi", "tv", "ac"]

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[]; // array of image URLs

  @Column({ type: 'int', nullable: true })
  size: number; // room size in sq meters

  @Column({ type: 'varchar', length: 50, nullable: true })
  viewType: string; // sea, city, garden

  @Column({ type: 'boolean', default: false })
  isSmokingAllowed: boolean;

  @Column({ type: 'boolean', default: false })
  isAccessible: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column({ type: 'text', nullable: true })
  maintenanceNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
