import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSocialInterface } from '../interfaces';

export class CreateSocialDto implements CreateSocialInterface {
  @ApiProperty({
    example: 'instagram',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required:true
  })
  image: any;
}
