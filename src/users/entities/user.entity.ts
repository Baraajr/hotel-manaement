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

  @Column({ type: 'varchar', nullable: true })
  passwordResetToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpires: Date | null;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'text', nullable: true })
  emailVerificationToken: string | null;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.Customer,
  })
  role: Roles;

  @OneToOne(() => CustomerProfile, (profile) => profile.user, { cascade: true })
  customerProfile: CustomerProfile;
}
