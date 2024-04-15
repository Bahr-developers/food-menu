import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateFoodRequest } from '../interfaces';

enum food_status {
  available = 'available',
  none = 'none',
  preparing = 'preparing'
}
enum status {
  active = 'active',
  inactive = 'inactive'
}

export class UpdateFoodDto implements Omit<UpdateFoodRequest, 'id'> {
  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  @IsOptional()
  name?: object;

  @ApiProperty({
    example: "660d5290e49538271705501e",
    required: true,
  })
  @IsString()
  @IsOptional()
  description?: object;

  @ApiProperty({
    example: "100$",
    required: true,
  })
  @IsString()
  @IsOptional()
  price?: string;

  @ApiProperty({
    isArray: true,
    maxItems: 8,
    type: 'array',
    format: 'binary',
  })
  @IsOptional()
  @IsArray()
  images?: any;

  @ApiProperty({
    examples: ['available', 'none', 'preparing'],
  })
  @IsEnum(food_status)
  @IsOptional()
  @IsString()
  food_status?: 'available' | 'none' | "preparing";

  @ApiProperty({
    examples: ['active', 'inactive'],
  })
  @IsOptional()
  @IsEnum(status)
  @IsString()
  status!: 'active' | 'inactive';
}
