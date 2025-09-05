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
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateCustomerProfileDto } from './dtos/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../intercpeptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AdminGuard } from '../guards/admin.guard';

@Serialize(UserDto)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getAllUser(@Query('offset') offset = '0', @Query('limit') limit = '10') {
    return this.usersService.getAllUsers(parseInt(offset), parseInt(limit));
  }

  @Get('getMe')
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  getUserById(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    return this.usersService.getUserById(id);
  }

  @Patch('updateMe')
  updateCurrentUser(
    @Body() body: UpdateCustomerProfileDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.updateUser(body, user.id);
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
