import { CreateTranslateInterface } from '../interfaces';
import { IsObject, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum type {
  content = 'content',
  error = 'error',
}

export class CreateTranslateDto implements CreateTranslateInterface {
  @ApiProperty({
    example: 'create_hello_translate',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: {
      uz: 'salom',
      en: 'hello',
    },
    required: true,
  })
  @IsObject()
  definition: Record<string, string>;

  @ApiProperty({
    examples: ['error', 'content'],
    required: true,
  })
  @IsEnum(type)
  @IsString()
  type: 'content' | 'error';
}
