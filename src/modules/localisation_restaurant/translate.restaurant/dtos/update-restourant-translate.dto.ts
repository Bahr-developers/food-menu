import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateRestourantTranslateRequest } from '../interfaces';

enum status {
  active = 'active',
  inactive = 'inactive',
}

export class UpdateRestourantTranslateDto implements Omit<UpdateRestourantTranslateRequest, 'id'> {
  @ApiProperty({
    enum: ['active', 'inactive'],
    required: false,
  })
  @IsOptional()
  @IsEnum(status)
  status: 'active' | 'inactive';

  @ApiProperty({
    example: {
      uz: 'salom',
      en: 'hello',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  definition?: Record<string, string>;
}
