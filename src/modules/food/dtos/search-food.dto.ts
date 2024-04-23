import { ApiProperty } from '@nestjs/swagger';

export class SearchFoodDto {
  @ApiProperty()
  restaurant_id: string;
}
