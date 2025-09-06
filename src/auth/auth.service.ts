import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { createHash, randomBytes } from 'crypto';
import { promisify } from 'util';
import { scrypt as _scrypt } from 'crypto';
import { SignupDto } from './dto/signup.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async hashPassword(token: string, salt: string) {
    const hashed = (await scrypt(token, salt, 32)) as Buffer;
    return hashed.toString('hex');
  }

  async signup(payload: SignupDto) {
    const { email, password, confirmPassword, fullName } = payload;

    if (confirmPassword !== password) {
      throw new BadRequestException('passwords do not match');
    }

    const existingUser = await this.usersService.getUserByEmail(email);

    if (existingUser) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hashedPass = await this.hashPassword(password, salt);
    const result = salt + '.' + hashedPass;

    const newUser = {
      email,
      password: result,
      isEmailVerified: false,
      emailVerificationToken: '',
      customerProfile: { fullName },
    };

    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    newUser.emailVerificationToken = hashedToken;

    const user = await this.usersService.createUser(newUser);
    console.log(verificationToken);
    console.log('created user: ', user);

    // Create verification URL
    const verifyUrl = `http://localhost:3000/auth/verify-email/${verificationToken}`;

    // ⚠️ Email sending not implemented yet
    // await this.emailService.send(user.email, 'Verify your email', `Click here: ${verifyUrl}`);

    return user;
  }

  async signin(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    // console.log('user', user);

    if (!user) {
      throw new BadRequestException('wrong email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'your account is deactivated, please reach our support to activate it',
      );
    }

    const [salt, storedPassword] = user.password.split('.');
    const hashedPass = await this.hashPassword(password, salt);

    if (storedPassword !== hashedPass) {
      throw new BadRequestException('wrong email or password');
    }

    return user;
  }

  async verifyEmail(token: string) {
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const user =
      await this.usersService.getUserByVerificationToken(hashedToken);

    if (!user) {
      throw new BadRequestException('invalid Token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;

    await this.usersService.saveUser(user);

    return {
      status: 'success',
      message: 'Email verified successfully',
    };
  }

  async forgotPassword(email: string) {
    // get user by email
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException('user with email does not exist');
    }

    if (!user.isActive) {
      throw new BadRequestException('This account is deactivated');
    }

    // create a random token for user
    const resetToken = randomBytes(16).toString('hex');

    const hashedToken = createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

    //save user
    await this.usersService.saveUser(user);

    // Create reset URL (frontend route)
    const resetURL = `http://localhost:3000/auth/reset-password/${resetToken}`;

    const subject = 'Password Reset Token';
    const textMessage = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, ignore this email.`;

    console.log(resetToken);
    // TODO: send email with resetURL
    // await this.emailService.send(user.email, subject, textMessage);

    return {
      status: 'success',
      message: 'Token sent to email!',
    };
  }

  async resetPassword(
    token: string,
    password: string,
    confirmPassword: string,
  ) {
    if (password !== confirmPassword) {
      throw new BadRequestException('passwords don not match');
    }

    const hashedToken = createHash('sha256').update(token).digest('hex');
    const user = await this.usersService.getUserByToken(hashedToken);

    if (!user) {
      throw new BadRequestException('token is invalid or expired');
    }

    const [salt] = user.password.split('.');

    const hashedPass = await this.hashPassword(password, salt);

    const result = salt + '.' + hashedPass;

    user.password = result;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    // save user to db
    await this.usersService.saveUser(user);

    return {
      status: 'success',
      message: ' password reset successfully',
    };
  }
}
