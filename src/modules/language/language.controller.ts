import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { Language } from './schemas/language.schema';
import { CreateLanguageDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Language")
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}
  
  @Get()
  async findAll(): Promise<Language[]> {
    return this.languageService.getLanguageList();
  }

  @Post("add")
  async create(@Body() payload: CreateLanguageDto) {
    await this.languageService.createLanguage(payload);
  }

  @Patch('edit/:id')
  async updateLanguage(@Param('id') id: string) {
    await this.languageService.updateLanguage({ id, title: 'salomlar update' });
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.languageService.deleteLanguage(id);
  }
}
