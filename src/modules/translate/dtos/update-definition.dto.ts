import { ApiProperty } from "@nestjs/swagger";
import { DefinitionUpdateRequest } from "../interfaces";
import { IsString } from "class-validator";

export class UpdateDefinitionDto implements Omit<DefinitionUpdateRequest,"id"> {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  value: string;
}