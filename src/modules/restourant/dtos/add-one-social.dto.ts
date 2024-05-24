import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateSocilsInterface } from '../interfaces';
import { AddOneSocialInterface } from '../../social/interfaces';

export class AddOneSocialDto implements AddOneSocialInterface {
  @ApiProperty({required: true})
  @IsString()
  @IsNotEmpty()
  restaurant_id: string;

  @ApiProperty({
    type: 'object',
    required: false
  })
  social: CreateSocilsInterface;
}
