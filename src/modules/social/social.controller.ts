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
  import { FileInterceptor } from '@nestjs/platform-express';
import { SocialService } from './social.service';
import { Social } from './schemas';
import { AddOneSocialDto, CreateSocialDto, UpdateSocialDto } from './dtos';
import { AddOneSocialInterface } from './interfaces';
  
  @ApiTags('Social')
  @Controller({
    path: 'social',
    version: '1.0',
  })
  export class SocialController {
    #_socialService: SocialService;
  
    constructor(social: SocialService) {
      this.#_socialService = social;
    }
  
    @Get('find/all')
    async getSocialList(
    ): Promise<Social[]> {
      return await this.#_socialService.getSocialList();
    }
  
    @Get('find/:socialId')
    async getSocialById(
        @Param('socialId') socialId: string
    ): Promise<Social[]> {
      return await this.#_socialService.getSocialById(socialId);
    }
  
    @ApiConsumes('multipart/form-data')
    @Post('add')
    @UseInterceptors(FileInterceptor('image'))
    createSocial(
      @Body() payload: CreateSocialDto,
      @UploadedFile() image: any,
    ): Promise<void> {
      return this.#_socialService.createSocial({ ...payload, image });
    }
  
    @ApiConsumes('multipart/form-data')
    @Patch('edit/:id')
    @UseInterceptors(FileInterceptor('image'))
    async updateSocial(
      @Param('id') socialId: string,
      @Body() payload: UpdateSocialDto,
      @UploadedFile() image: any,
    ): Promise<void> {
      await this.#_socialService.updateSocial({
        ...payload,
        id: socialId,
        image,
      });
    }
  
    @Delete('delete/:id')
    async deleteSocial(@Param('id') socialId: string): Promise<void> {
      await this.#_socialService.deleteSocial(socialId);
    }
  }
  