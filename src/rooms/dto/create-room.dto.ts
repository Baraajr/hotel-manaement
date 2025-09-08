import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsString()
  roomType: string;

  @IsNumber()
  capacity: number;

  @IsNumber()
  pricePerNight: number;

  @IsOptional()
  @IsNumber()
  floor?: number;

  @IsOptional()
  @IsNumber()
  bedCount?: number;

  @IsOptional()
  @IsString()
  bedType?: string;

  @IsOptional()
  @IsArray()
  amenities?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsString()
  viewType?: string;

  @IsOptional()
  @IsBoolean()
  isSmokingAllowed?: boolean;

  @IsOptional()
  @IsBoolean()
  isAccessible?: boolean;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsOptional()
  @IsString()
  maintenanceNotes?: string;
}
