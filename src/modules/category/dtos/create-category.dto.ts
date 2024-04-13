import { CreateCategoryInterface } from '../interfaces';
import { IsObject, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto implements Omit<CreateCategoryInterface, 'image'> {
  @ApiProperty({
    example: '660d5290e49538271705501e',
    required: true,
  })
  @IsString()
  name: string;
}
