import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateFoodRequest } from '../interfaces';

export class UpdateFoodDto implements Omit<UpdateFoodRequest, 'id'> {
  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  name?: object;

  @ApiProperty({
    example: "660d5290e49538271705501e",
    required: true,
  })
  @IsString()
  description?: object;

  @ApiProperty({
    example: "100$",
    required: true,
  })
  @IsString()
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
}
