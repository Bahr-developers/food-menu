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
import { AddOneSocialDto, CreateRestourantDto, DeleteOneSocialDto, UpdateRestourantDto } from './dtos';
import { Restourant } from './schemas';
import { FileInterceptor } from '@nestjs/platform-express';
import { RestourantService } from './restourant.service';

@ApiTags('Restourant')
@Controller({
  path: 'restourant',
  version: '1.0',
})
export class RestourantController {
  #_restourantService: RestourantService;

  constructor(restourant: RestourantService) {
    this.#_restourantService = restourant;
  }

  @Get('find/all')
  async getRestourantList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Restourant[]> {
    return  await this.#_restourantService.getRestourantList(languageCode);
  }
  
  @Get('find/one/:id')
  async getOneRestourant(
    @Param('id') restourantId: string,
    @Headers('accept-language') languageCode: string,
  ): Promise<Restourant> {
    return await this.#_restourantService.getOneRestourant(restourantId, languageCode);
  }

  @ApiConsumes('multipart/form-data')
  @Post('add')
  @UseInterceptors(FileInterceptor('image'))
  createRestourant(
    @Body() payload: CreateRestourantDto,
    @UploadedFile() image: any,
    ): Promise<void> {
      return this.#_restourantService.createRestourant({ ...payload, image });
    }

  @Post('add/one/social')
  async addOneSocial(
    @Body() payload: AddOneSocialDto,
  ) {
    await this.#_restourantService.addOneSocial({ ...payload });
  }

  @ApiConsumes('multipart/form-data')
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateRestourant(
    @Param('id') restourantId: string,
    @Body() payload: UpdateRestourantDto,
    @UploadedFile() image: any,
  ): Promise<void> {
    await this.#_restourantService.updateRestourant({
      ...payload,
      id: restourantId,
      image,
    });
  }

  @Delete('delete/one/social')
  async deleteOneSocial(@Body() payload: DeleteOneSocialDto): Promise<void> {
    await this.#_restourantService.deleteOneSocial(payload);
  }

  @Delete('delete/:id')
  async deleteRestourant(@Param('id') restourantId: string): Promise<void> {
    await this.#_restourantService.deleteRestourant(restourantId);
  }
}
