import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFoodInterface } from '../interfaces';

export class CreateFoodDto implements CreateFoodInterface {
  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  name: object;

  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  description: object;

  @ApiProperty({
    example: '100$',
    required: true,
  })
  @IsString()
  price: string;

  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  category_id: string;

  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  restourant_id: string;

  @ApiProperty({
    maxItems: 8,
    type: 'array',
    format: 'binary',
  })
  images: any;
}
