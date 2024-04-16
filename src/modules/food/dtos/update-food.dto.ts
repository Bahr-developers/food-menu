import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
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
  @IsString()
  @IsOptional()
  name?: object;

  @ApiProperty({
    example: '{ "uz": "salom", "en": "salom"}',
    required: false,
  })
  @IsString()
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
    maxItems: 8,
    type: 'array',
    items: {
      format: 'binary',
      type: 'string',
    },
    required: false,
  })
  @IsOptional()
  @IsArray()
  images?: any;

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
