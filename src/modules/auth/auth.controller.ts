import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Delete,
  Headers,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginForAdminDto } from './dtos';
import { LoginForAdminResponse } from './interfaces';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1.0',
})
export class AuthController {
  #_authService: AuthService;

  constructor(auth: AuthService) {
    this.#_authService = auth;
  }
  @Post('login')
  createRestourant(
    @Body() payload: LoginForAdminDto,
  ): Promise<LoginForAdminResponse> {
    return this.#_authService.LoginUser({ ...payload });
  }
}
