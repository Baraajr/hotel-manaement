import { MoreThan } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CustomerProfile } from './customer-profile.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(CustomerProfile)
    private profileRepo: Repository<CustomerProfile>,
  ) {}

  async saveUser(user: Partial<User>) {
    await this.repo.save(user);
  }

  getAllUsers(offset: number, limit: number) {
    return this.repo.find({
      skip: offset,
      take: limit,
      order: { id: 'ASC' }, // optional ordering

      relations: ['customerProfile'],
    });
  }

  async getUserById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['customerProfile'],
    });
  }

  async getUserByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    // console.log('user', user);
    return user;
  }

  async getUserByToken(passwordResetToken: string) {
    const now = new Date();

    const user = await this.repo.findOne({
      where: {
        passwordResetToken,
        passwordResetExpires: MoreThan(now), // token still valid
      },
    });

    return user;
  }

  async getUserByVerificationToken(token: string) {
    return this.repo.findOne({
      where: { emailVerificationToken: token },
    });
  }

  async createUser(payload: CreateUserDto) {
    const user = this.repo.create(payload); // create User entity
    return await this.repo.save(user); // saves user + customerProfile
  }

  async updateUser(payload: Partial<CustomerProfile>, id: string) {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['customerProfile'], // include relation
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.customerProfile) {
      Object.assign(user.customerProfile, payload);
    } else {
      user.customerProfile = payload as CustomerProfile;
    }

    return this.repo.save(user);
  }

  async deactivateUser(id: string) {
    const user = await this.getUserById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.isActive = false;

    return await this.repo.save(user);
  }

  async activateUser(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.isActive = true;
    return this.repo.save(user);
  }
}
