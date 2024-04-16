import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRestourantDto {
  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: false,
  })
  @IsString()
  name?: string;

  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Toshkent, Yunusobod',
    required: false,
  })
  @IsString()
  location?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false
  })
  @IsOptional()
  image?: any;
}
