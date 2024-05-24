import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator";
import { DeleteOneSocialInterface } from "../interfaces";

export class DeleteOneSocialDto implements DeleteOneSocialInterface {
  @ApiProperty({required:true})
  @IsString()
  @IsNotEmpty()
  restourant_id: string;

  @ApiProperty({required:true})
  @IsString()
  @IsNotEmpty()
  social_id: string;
}