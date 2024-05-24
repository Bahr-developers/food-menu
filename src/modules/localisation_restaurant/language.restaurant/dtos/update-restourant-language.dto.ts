import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateRestourantLanguageRequest } from '../interfaces';

export class UpdateLanguageRestourantDto implements Omit<UpdateRestourantLanguageRequest, 'id'> {
  @ApiProperty({
    example: "O'zbek tili",
    maxLength: 64,
    required: true
  })
  @IsString()
  @MaxLength(64)
  @IsOptional()
  title?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required:false
  })
  @IsOptional()
  image?: any;
}
