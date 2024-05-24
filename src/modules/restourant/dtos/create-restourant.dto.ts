import { CreateRestourantInterface, CreateSocilsInterface } from '../interfaces';
import { IsOptional, IsPassportNumber, IsPhoneNumber, IsString } from 'class-validator';
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
    required: false,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Toshkent, Yunusobod',
    required: false,
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: '+998931208896',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber("UZ")
  tel: string;

  @ApiProperty({
    example: '5',
    required: false,
  })
  @IsOptional()
  @IsString()
  service_percent?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
    },
    required: false
  })
  socials: CreateSocilsInterface[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: any;
}