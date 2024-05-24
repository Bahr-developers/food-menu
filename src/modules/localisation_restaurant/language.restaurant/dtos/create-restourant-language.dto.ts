import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CreateRestourantLanguageRequest } from "../interfaces";

export class CreateRestourantLanguageDto implements CreateRestourantLanguageRequest {
  @ApiProperty({
    example: 'uz',
    maxLength: 2,
    type: String,
    required: true,
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  code: string;

  @ApiProperty({
    example: 'O\'zbek tili',
    maxLength: 64,
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  title: string;

  @ApiProperty({
    example: '6646196111056e6d4ebd16ff',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  restourant_id: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required:true
  })
  image: any;
}