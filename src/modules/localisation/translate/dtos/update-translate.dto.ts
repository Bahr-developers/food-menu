import { UpdateTranslateRequest } from '../interfaces';
import { IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum status {
  active = 'active',
  inactive = 'inactive',
}

export class UpdateTranslateDto implements Omit<UpdateTranslateRequest, 'id'> {
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
