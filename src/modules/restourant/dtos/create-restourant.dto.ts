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
    type: 'string',
    format: 'binary',
  })
  image: any;
}