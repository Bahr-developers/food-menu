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
    UploadedFiles,
    Query
  } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Food } from './schemas';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FoodService } from './food.service';
import { CreateFoodDto, UpdateFoodDto } from './dtos';
  
  @ApiTags('Food')
  @Controller({
    path: 'food',
    version: '1.0',
  })
  export class FoodController {
    #_foodService: FoodService;
  
    constructor(food: FoodService) {
      this.#_foodService = food;
    }
  
    @Get('find/all')
    async getServiceList(
      @Headers('accept-language') languageCode: string
    ): Promise<Food[]> {
      return await this.#_foodService.getFoodList(languageCode);
    }
  
    @Get('search')
    async searchFood(
      @Headers('accept-language') languageCode: string,
      @Query('name') name: string,
      @Body('restourant_id') restourant_id:string
    ): Promise<Food[]> {
      return await this.#_foodService.searchFood({name, restourant_id, languageCode});
    }
    
    @ApiConsumes("multipart/form-data")
    @Post('add')
    @UseInterceptors(FilesInterceptor('images'))
    createProject(
      @Body() payload: CreateFoodDto,
      @UploadedFiles() images: any[]
    ): Promise<void> {
      return this.#_foodService.createFood({...payload, images});
    }

    @ApiConsumes("multipart/form-data")
    @Patch('edit/:id')
    @UseInterceptors(FilesInterceptor('images'))
    async updateFood(
      @Param('id') projectId: string,
      @Body() payload: UpdateFoodDto,
      @UploadedFiles() images: any
    ): Promise<void> {
      await this.#_foodService.updateFood({ ...payload, id: projectId, images });
    }
  
    @Delete('delete/:id')
    async deleteProject(@Param('id') foodId: string): Promise<void> {
      await this.#_foodService.deleteFood(foodId);
    }
}