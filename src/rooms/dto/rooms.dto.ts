import { Expose } from 'class-transformer';

export class RoomDto {
  @Expose() id: number;
  @Expose() roomNumber: string;
  @Expose() roomType: string;
  @Expose() capacity: number;
  @Expose() pricePerNight: number;
  @Expose() status: string;
  @Expose() floor?: number;
  @Expose() bedCount?: number;
  @Expose() bedType?: string;
  @Expose() amenities?: string[];
  @Expose() description?: string;
  @Expose() images?: string[];
  @Expose() size?: number;
  @Expose() viewType?: string;
  @Expose() isSmokingAllowed?: boolean;
  @Expose() isAccessible?: boolean;
  @Expose() discountPrice?: number;
  @Expose() maintenanceNotes?: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
