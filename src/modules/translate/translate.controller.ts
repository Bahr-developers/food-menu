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
import { TranslateService } from './translate.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateTranslateDto,
  UpdateDefinitionDto,
  UpdateTranslateDto,
} from './dtos';
import { 
  GetSingleTranslateResponse, 
  GetSingleTranslateByCodeResponse 
} from './interfaces';
import { Translate } from './schemas';

@ApiTags('Translate')
@Controller({
  path: 'translate',
  version: '1.0',
})
export class TranslateController {
  #_service: TranslateService;

  constructor(service: TranslateService) {
    this.#_service = service;
  }

  @Get()
  async getTranslateList(): Promise<Translate[]> {
    return await this.#_service.getTranslateList();
  }

  @Get('single/:code')
  async getSingleTranslateByCode(
    @Headers('accept-language') languageCode: string,
    @Param('code') translateCode: string,
  ): Promise<GetSingleTranslateByCodeResponse> {
    return await this.#_service.getSingleTranslateByCode({
      languageCode,
      translateCode
      });
  }

  @Get('/unused')
  async getUnusedTranslateList(): Promise<Translate[]> {
    return await this.#_service.getUnusedTranslateList();
  }

  @Get('single/:id')
  async retrieveSingleTranslate(
    @Headers('accept-language') languageCode: string,
    @Param('id') translateId: string,
  ): Promise<GetSingleTranslateResponse> {
    return await this.#_service.getSingleTranslate({
      languageCode,
      translateId,
    });
  }

  @Post('add')
  async createTranslate(@Body() payload: CreateTranslateDto): Promise<Object> {
    return await this.#_service.createTranslate(payload);
  }

  @Patch('edit/:id')
  async updateTranslate(
    @Param('id') translateId: string,
    @Body() payload: UpdateTranslateDto,
  ): Promise<String> {
    return await this.#_service.updateTranslate({ ...payload, id: translateId });
  }

  @Patch('edit/definition/:id')
  async updateDefinition(
    @Param('id') definitionId: string,
    @Body() payload: UpdateDefinitionDto,
  ): Promise<void> {
    await this.#_service.updateDefinition({ ...payload, id: definitionId });
  }

  @Delete('delete/:id')
  async deleteTranslate(@Param('id') translateId: string): Promise<void> {
    await this.#_service.deleteTranslate(translateId);
  }
}
