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
    UploadedFile
  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { Category } from './schemas';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
  
  @ApiTags('Category')
  @Controller({
    path: 'category',
    version: '1.0',
  })
  export class CategoryController {
    #_categoryService: CategoryService;
  
    constructor(restourant: CategoryService) {
      this.#_categoryService = restourant;
    }
  
    @Post('add')
    @UseInterceptors(FileInterceptor('image'))
    createCategory(
      @Body() payload: CreateCategoryDto,
      @UploadedFile() image: any
    ): Promise<void> {
      return this.#_categoryService.createCategory({...payload, image});
    }

    @Get('find/all')
    async getCategoryList(
      @Headers('accept-language') languageCode: string
      ): Promise<Category[]> {
        return await this.#_categoryService.getCategoryList(languageCode);
    }


    @Patch('edit/:id')
    @UseInterceptors(FileInterceptor('image'))
    async updateCategory(
      @Param('id') restourantId: string,
      @Body() payload: UpdateCategoryDto,
      @UploadedFile() image: any
    ): Promise<void> {
      await this.#_categoryService.updateCategory({ ...payload, id: restourantId, image });
    }
  
    @Delete('delete/:id')
    async deleteCategory(@Param('id') restourantId: string): Promise<void> {
      await this.#_categoryService.deleteCategory(restourantId);
    }
}