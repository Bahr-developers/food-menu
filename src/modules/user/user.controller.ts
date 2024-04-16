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
  import { CreateUserDto, UpdateUserDto } from './dtos';
  import { User } from './schemas';
  import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
  
  @ApiTags('User')
  @Controller({
    path: 'user',
    version: '1.0',
  })
  export class UserController {
    #_userService: UserService;
  
    constructor(user: UserService) {
      this.#_userService = user;
    }
  
    @Get('find/all')
    async getUserList(
    ): Promise<User[]> {
      return await this.#_userService.getUserList();
    }
  
    @Post('add')
    createUser(
      @Body() payload: CreateUserDto,
    ): Promise<void> {
      return this.#_userService.createUser({ ...payload });
    }
  
    @Patch('edit/:id')
    async updateUser(
      @Param('id') userId: string,
      @Body() payload: UpdateUserDto,
    ): Promise<void> {
      await this.#_userService.updateUser({
        ...payload,
        id: userId,
      });
    }
  
    @Delete('delete/:id')
    async deleteUser(@Param('id') userId: string): Promise<void> {
      await this.#_userService.deleteUser(userId);
    }
  }
  