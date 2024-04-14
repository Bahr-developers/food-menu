import { CreateRestourantInterface } from '../interfaces';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestourantDto implements CreateRestourantInterface {
  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  location: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @IsString()
  image: any;
}
