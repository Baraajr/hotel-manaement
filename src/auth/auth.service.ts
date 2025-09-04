import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';
import { SignupDto } from './dto/signup.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(payload: SignupDto) {
    const { email, password, confirmPassword, fullName } = payload;

    if (confirmPassword !== password) {
      throw new BadRequestException('passwords do not match');
    }

    const user = await this.usersService.getUserByEmail(email);

    if (user) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hashedPass = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hashedPass.toString('hex');

    const createUser = {
      email,
      password: result,
      fullName,
    };

    // console.log(payload);

    return this.usersService.createUser(createUser);
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    // console.log('user', user);

    if (!user) {
      throw new BadRequestException('wrong email or password');
    }

    const [salt, storedPassword] = user.password.split('.');
    const hashedPass = (await scrypt(password, salt, 32)) as Buffer;

    if (storedPassword !== hashedPass.toString('hex')) {
      throw new BadRequestException('wrong email or password');
    }

    return user;
  }
}
