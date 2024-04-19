import { IsString, IsArray, IsNumber, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserInterface } from '../interfaces';

export class CreateUserDto implements CreateUserInterface {
  @ApiProperty({
    example: 'Zikirov Abubakir',
    required: true,
  })
  full_name: string;

  @ApiProperty({
    example: '+998931208896',
    required: true,
  })
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example:"qwerty",
    required:true
  })
  @IsString()
  password:string

  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  restourant_id: string;
}
