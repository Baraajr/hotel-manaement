import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateCustomerProfileDto } from './dtos/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../intercpeptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AdminGuard } from '../guards/admin.guard';
import { ApiBadRequestResponse } from '@nestjs/swagger';

@Serialize(UserDto)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async getAllUser(
    @Query('offset') offset = '0',
    @Query('limit') limit = '10',
  ) {
    const users = await this.usersService.getAllUsers(
      parseInt(offset),
      parseInt(limit),
    );

    return {
      message: 'users fetched successfully',
      data: users,
    };
  }

  @Get('getMe')
  getCurrentUser(@CurrentUser() user: User) {
    return { data: user, message: 'user fetched successfully' };
  }

  @Get('/:id')
  async getUserById(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const fetchedUser = await this.usersService.getUserById(id);
    return { data: fetchedUser, message: 'user fetched successfully' };
  }

  @Patch('updateMe')
  async updateCurrentUser(
    @Body() body: UpdateCustomerProfileDto,
    @CurrentUser() user: User,
  ) {
    const updateUser = await this.usersService.updateUser(body, user.id);

    return { data: updateUser, message: 'user fetched successfully' };
  }

  // @UseInterceptors(undefined) // disables interceptor for this route
  @Delete('deleteMe')
  async deleteMe(@CurrentUser() user: User, @Session() session: any) {
    await this.usersService.deactivateUser(user.id);
    session.userId = null;
    return Promise.resolve({
      status: 'success',
      message: 'account deactivated successfully',
    });
  }

  // admin Routes
  @UseGuards(AdminGuard)
  @Patch('activateUser/:id')
  activateUser(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    return this.usersService.activateUser(id);
  }
}
