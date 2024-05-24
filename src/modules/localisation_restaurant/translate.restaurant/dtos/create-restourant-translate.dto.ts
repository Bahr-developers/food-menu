import { IsObject, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateRestourantTranslateInterface } from '../interfaces';

enum type {
  content = 'content',
  error = 'error',
}

export class CreateRestourantTranslateDto implements CreateRestourantTranslateInterface {
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
  
  @ApiProperty({
    example: '6646196111056e6d4ebd16ff',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  restourant_id: string;
}
