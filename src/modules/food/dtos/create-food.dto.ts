import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFoodInterface } from '../interfaces';

export class CreateFoodDto implements CreateFoodInterface {
  @ApiProperty({
    example: '{ "uz": "salom", "en": "salom"}',
    required: true,
  })
  name: object;

  @ApiProperty({
    example: '{ "uz": "salom", "en": "salom"}',
    required: true,
  })
  description: object;


  @ApiProperty({
    example: '12000',
    required: true,
  })
  @IsString()
  price: string;

  @ApiProperty({
    example: '{ "start_time": "10", "end_time": "20"}',
    required: false,
  })
  @IsOptional()
  preparing_time?: object;

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
    items: {
      format: 'binary',
      type: 'string',
    },
  })
  images: any;
}
