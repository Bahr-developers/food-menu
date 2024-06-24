import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRestourantTranslateDto, UpdateRestourantDefinitionDto, UpdateRestourantTranslateDto } from './dtos';
import { GetSingleRestourantTranslateByCodeRequest, GetSingleRestourantTranslateByCodeResponse, GetSingleRestourantTranslateResponse } from './interfaces';
import { TranslateRestourant } from './schemas';
import { RestourantTranslateService } from './restourant-translate.service';

@ApiTags('RestourantTranslate')
@Controller({
  path: 'restourant-translate',
  version: '1.0',
})
export class RestourantTranslateController {
  #_service: RestourantTranslateService;

  constructor(service: RestourantTranslateService) {
    this.#_service = service;
  }

  @Get(":restaurantId")
  async getRestourantTranslateList(@Param("restaurantId") id: string): Promise<TranslateRestourant[]> {
    return await this.#_service.getRestourantTranslateList(id);
  }

  @Get('single/:code')
  async getSingleRestourantTranslateByCode(
    @Headers('accept-language') languageCode: string,
    @Param('code') translateCode: string,
    @Body('restourant_id') restourant_id: string
  ): Promise<GetSingleRestourantTranslateByCodeResponse> {
    return await this.#_service.getSingleRestourantTranslateByCode({
      languageCode,
      translateCode,
      restourant_id,
      });
  }

  @Get('/unused/:restaurant_id')
  async getUnusedTranslateList(@Param('restaurant_id') restaurant_id: string): Promise<TranslateRestourant[]> {
    return await this.#_service.getUnusedTranslateList(restaurant_id);
  }

  @Get('single/:id')
  async getSingleRestourantTranslate(
    @Headers('accept-language') languageCode: string,
    @Param('id') translateId: string,
    @Body('restourant_id') restourant_id: string
  ): Promise<GetSingleRestourantTranslateResponse> {
    return await this.#_service.getSingleRestourantTranslate({
      languageCode,
      translateId,
      restourant_id
    });
  }

  @Post('add')
  async createTranslate(@Body() payload: CreateRestourantTranslateDto): Promise<Object> {
    return await this.#_service.createTranslate(payload);
  }

  @Patch('edit/:id')
  async updateRestourantTranslate(
    @Param('id') translateId: string,
    @Body() payload: UpdateRestourantTranslateDto,
  ): Promise<void> {
   await this.#_service.updateRestourantTranslate({ ...payload, id: translateId });
  }

  @Patch('edit/definition/:id')
  async updateRestourantDefinition(
    @Param('id') definitionId: string,
    @Body() payload: UpdateRestourantDefinitionDto,
  ): Promise<void> {
    await this.#_service.updateRestourantDefinition({ ...payload, id: definitionId });
  }

  @Delete('delete/:id')
  async deleteRestourantTranslate(@Param('id') translateId: string): Promise<void> {
    await this.#_service.deleteRestourantTranslate(translateId);
  }
}
