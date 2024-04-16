import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserInterface } from '../interfaces';

export class UpdateUserDto implements CreateUserInterface {
  @ApiProperty({
    example: 'Zikirov Abubakir',
    required: false,
  })
  @IsOptional()
  full_name: string;

  @ApiProperty({
    example: '+998931208896',
    required: false,
  })
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: false,
  })
  @IsString()
  @IsOptional()
  restourant_id: string;
}
