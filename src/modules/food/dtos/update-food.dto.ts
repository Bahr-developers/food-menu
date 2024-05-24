import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateFoodRequest } from '../interfaces';

enum food_status {
  available = 'available',
  none = 'none',
  preparing = 'preparing',
}
enum status {
  active = 'active',
  inactive = 'inactive',
}

export class UpdateFoodDto implements Omit<UpdateFoodRequest, 'id'> {
  @ApiProperty({
    example: '{ "uz": "salom", "en": "salom"}',
    required: false,
  })
  @IsOptional()
  name?: object;

  @ApiProperty({
    example: '{ "uz": "salom", "en": "salom"}',
    required: false,
  })
  @IsOptional()
  description?: object;

  @ApiProperty({
    example: '10000',
    required: false,
  })
  @IsString()
  @IsOptional()
  price?: string;

  @ApiProperty({
    example: '10',
    required: false,
  })
  @IsOptional()
  @IsString()
  preparing_time?: string;

  @ApiProperty({
    examples: ['available', 'none', 'preparing'],
    required: false,
  })
  @IsEnum(food_status)
  @IsOptional()
  @IsString()
  food_status?: 'available' | 'none' | 'preparing';

  @ApiProperty({
    examples: ['active', 'inactive'],
    required: false,
  })
  @IsOptional()
  @IsEnum(status)
  @IsString()
  status!: 'active' | 'inactive';
}
