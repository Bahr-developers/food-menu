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
    @Get('find/:restaurant_id')
    async getUserByRestourantId(
    @Param('restaurantId') restaurantId: string,
    ): Promise<User> {
      return await this.#_userService.getUserByRestourantId(restaurantId);
    }
  
    @ApiConsumes('multipart/form-data')
    @Post('add')
    @UseInterceptors(FileInterceptor('image'))
    createUser(
      @Body() payload: CreateUserDto,
      @UploadedFile() image: any,
    ): Promise<void> {
      return this.#_userService.createUser({ ...payload, image });
    }
  
    @ApiConsumes('multipart/form-data')
    @Patch('edit/:id')
    @UseInterceptors(FileInterceptor('image'))
    async updateUser(
      @Param('id') userId: string,
      @Body() payload: UpdateUserDto,
      @UploadedFile() image: any,
    ): Promise<void> {
      await this.#_userService.updateUser({
        ...payload,
        id: userId,
        image
      });
    }
  
    @Delete('delete/:id')
    async deleteUser(@Param('id') userId: string): Promise<void> {
      await this.#_userService.deleteUser(userId);
    }
  }
  