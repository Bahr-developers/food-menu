import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { RestourantDefinitionUpdateRequest } from "../interfaces";

export class UpdateRestourantDefinitionDto implements Omit<RestourantDefinitionUpdateRequest,"id"> {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  value: string;
}