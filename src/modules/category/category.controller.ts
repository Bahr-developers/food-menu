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

  @Get('find/all')
  async getCategoryList(
    @Headers('accept-language') languageCode: string,
  ): Promise<Category[]> {
    return await this.#_categoryService.getCategoryList(languageCode);
  }

  @Get('find/:categoryId')
  async getCategoryById(
    @Headers('accept-language') languageCode: string,
    @Param('categoryId') categoryId:string,
    @Body('restaurant_id') restaurant_id:string
  ): Promise<Category[]> {
    return await this.#_categoryService.getCategoryById({languageCode, categoryId, restaurant_id});
  }

  @Get('find/by/restaurant/:restaurantId')
  async getCategoryListByRestaurantId(
    @Headers('accept-language') languageCode: string,
    @Param('restaurantId') restaurantId: string,
  ): Promise<Category[]> {
    return await this.#_categoryService.getCategoryListByRestaurantId(
      languageCode,
      restaurantId,
    );
  }

  @Get('find/by/restaurant/admin/:restaurantId')
  async getCategoryListByRestaurantIdForAdmins(
    @Headers('accept-language') languageCode: string,
    @Param('restaurantId') restaurantId: string,
  ): Promise<Category[]> {
    return await this.#_categoryService.getCategoryListByRestaurantIdForAdmins(
      languageCode,
      restaurantId,
    );
  }

  @ApiConsumes('multipart/form-data')
  @Post('add')
  @UseInterceptors(FileInterceptor('image'))
  createCategory(
    @Body() payload: CreateCategoryDto,
    @UploadedFile() image: any,
  ): Promise<void> {
    return this.#_categoryService.createCategory({ ...payload, image });
  }

  @ApiConsumes('multipart/form-data')
  @Post('add-restourant-language')
  @UseInterceptors(FileInterceptor('image'))
  createCategoryforRestourantLanguages(
    @Body() payload: CreateCategoryDto,
    @UploadedFile() image: any,
  ): Promise<void> {
    return this.#_categoryService.createCategoryforRestourantLanguages({ ...payload, image });
  }

  @ApiConsumes('multipart/form-data')
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('id') restourantId: string,
    @Body() payload: UpdateCategoryDto,
    @UploadedFile() image: any,
  ): Promise<void> {
    await this.#_categoryService.updateCategory({
      ...payload,
      id: restourantId,
      image,
    });
  }

  @Delete('delete/:id')
  async deleteCategory(@Param('id') restourantId: string): Promise<void> {
    await this.#_categoryService.deleteCategory(restourantId);
  }
}
