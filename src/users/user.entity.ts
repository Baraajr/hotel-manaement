import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerProfile } from './customer-profile.entity';

export enum Roles {
  Admin = 'admin',
  Staff = 'staff',
  Customer = 'customer',
  Manager = 'manager',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.Customer,
  })
  role: Roles;

  @OneToOne(() => CustomerProfile, (profile) => profile.user, { cascade: true })
  customerProfile: CustomerProfile;
}
