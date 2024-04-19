import { IsPhoneNumber, IsString } from 'class-validator';
import { LoginForAdminRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class LoginForAdminDto implements LoginForAdminRequest {
  @ApiProperty({
      example: '+998931208896',
      required: true,
  })
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @ApiProperty({
    example: 'qwerty',
    required: true,
  })
  @IsString()
  password: string;
}