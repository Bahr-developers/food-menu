import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateRestourantLanguageDto, UpdateLanguageRestourantDto } from './dtos';
import { RestourantLanguageService } from './restourant-language.service';
import { LanguageRestourant } from './schemas';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags("LanguageRestourant")
@Controller('language-restourant')
export class RestourantLanguageController {
  constructor(private readonly restourantLanguageService: RestourantLanguageService) {}
  
  @Get(":restaurantId")
  async findAll(@Param("restaurantId") id: string): Promise<LanguageRestourant[]> {
    return this.restourantLanguageService.getLanguageList(id);
  }

  @ApiConsumes('multipart/form-data')
  @Post("add")
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() payload: CreateRestourantLanguageDto,@UploadedFile() image: any  ) {
    await this.restourantLanguageService.createLanguage({...payload, image});
  }

  @ApiConsumes('multipart/form-data')
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateLanguage(@Param('id') id: string,@Body() payload: UpdateLanguageRestourantDto, @UploadedFile() image: any,
  ) {
    await this.restourantLanguageService.updateLanguage({ ...payload, id, image });
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.restourantLanguageService.deleteLanguage(id);
  }
}
