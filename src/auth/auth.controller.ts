import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Serialize } from '../intercpeptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { SignDto } from './dto/sign.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // @Serialize(UserDto)
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    const user = await this.authService.signup(body);
    return {
      status: 'success',
      message: 'User registered successfully. Please verify your email.',
      data: user,
    };

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

  @Post('forgot-password')
  forgetPaswword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Patch('reset-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() body: { password: string; confirmPassword: string },
  ) {
    return this.authService.resetPassword(
      token,
      body.password,
      body.confirmPassword,
    );
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
