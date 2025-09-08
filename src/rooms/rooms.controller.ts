import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { RoomDto } from './dto/rooms.dto';
import { Serialize } from 'src/intercpeptors/serialize.interceptor';

@Serialize(RoomDto)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    const room = await this.roomsService.create(createRoomDto);

    return {
      status: 'success',
      message: 'room created successfully',
      data: room,
    };
  }

  @Get()
  async findAll() {
    const rooms = await this.roomsService.findAll();

    return {
      status: 'success',
      messages: 'rooms fetched succeessfully',
      data: rooms,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const room = await this.roomsService.findOne(id);

    return {
      message: 'room fetshed successfully',
      status: 'success',
      data: room,
    };
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    const room = await this.roomsService.update(id, updateRoomDto);

    return {
      status: 'success',
      message: 'room updated successfully',
      data: room,
    };
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.roomsService.remove(id);
  }
}
