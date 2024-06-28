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
import { LanguageService } from './language.service';
import { Language } from './schemas/language.schema';
import { CreateLanguageDto, UpdateLanguageDto } from './dtos';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get()
  async findAll(): Promise<Language[]> {
    return this.languageService.getLanguageList();
  }

  @ApiConsumes('multipart/form-data')
  @Post('add')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() payload: CreateLanguageDto, @UploadedFile() image: any) {
    await this.languageService.createLanguage({ ...payload, image });
  }

  @ApiConsumes('multipart/form-data')
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateLanguage(
    @Param('id') id: string,
    @Body() payload: UpdateLanguageDto,
    @UploadedFile() image: any,
  ) {
    await this.languageService.updateLanguage({ ...payload, id, image });
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.languageService.deleteLanguage(id);
  }
}
