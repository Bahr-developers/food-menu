import { ApiProperty } from '@nestjs/swagger';
import { AddOneFoodImageInterface } from '../interfaces';

export class AddOneFoodImageDto implements AddOneFoodImageInterface {
  @ApiProperty()
  foodId: string;

  @ApiProperty({
    type: 'string',
    format: 'buffer',
  })
  image: any;
}
