import { ApiProperty } from "@nestjs/swagger"
import { DeleteFoodImageInterface } from "../interfaces";

export class DeleteFoodImageDto implements DeleteFoodImageInterface {
  @ApiProperty()
  foodId: string;

  @ApiProperty()
  image_url: string;
}