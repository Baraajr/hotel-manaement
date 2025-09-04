import { Expose, Type } from 'class-transformer';

export class CustomerProfile {
  @Expose()
  fullName: string;

  @Expose()
  phone?: string;

  @Expose()
  idPassport?: string;

  @Expose()
  address?: string;
}

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => CustomerProfile)
  customerProfile: CustomerProfile;
}
