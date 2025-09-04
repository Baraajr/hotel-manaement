import { Body, Controller, HttpCode, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Serialize } from '../intercpeptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { SignDto } from './dto/sign.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Serialize(UserDto)
  @Post('signup')
  async signup(@Body() body: SignupDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: SignDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    session.userId = user.id;

    return {
      status: 'success',
      message: ' logged in successfully',
    };
  }

  @Post('signout')
  @HttpCode(200)
  signout(@Session() session: any) {
    session.userId = null;
    return {
      status: 'success',
      message: 'signed out successfully',
    };
  }
}
