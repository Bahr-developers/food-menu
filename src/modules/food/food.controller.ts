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
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Food } from './schemas';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FoodService } from './food.service';
import {
  AddOneFoodImageDto,
  CreateFoodDto,
  DeleteFoodImageDto,
  UpdateFoodDto,
} from './dtos';

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

  @Get('find/all/:restourant_id')
  async getServiceList(
    @Param("restourant_id") restourant_id: string,
    @Headers('accept-language') languageCode: string,
  ): Promise<Food[]> {
    return await this.#_foodService.getFoodList(languageCode, restourant_id);
  }

  @Get(':restaurantId/search')
  async searchFood(
    @Headers('accept-language') languageCode: string,
    @Query('name') name: string,
    @Param('restaurantId') restaurantId: string,
  ): Promise<Food[]> {
    return await this.#_foodService.searchFood({
      name,
      languageCode,
      restaurant_id: restaurantId,
    });
  }

  @ApiConsumes('multipart/form-data')
  @Post('add')
  @UseInterceptors(FilesInterceptor('images'))
  createProject(
    @Body() payload: CreateFoodDto,
    @UploadedFiles() images: any[],
  ): Promise<void> {
    return this.#_foodService.createFood({ ...payload, images });
  }

  @ApiConsumes('multipart/form-data')
  @Post('add/one/food-image')
  @UseInterceptors(FileInterceptor('image'))
  async addOneFoodImage(
    @Body() payload: AddOneFoodImageDto,
    @UploadedFile() image: any,
  ) {
    await this.#_foodService.addOneFoodImage({ image, ...payload });
  }

  @Patch('edit/:id')
  async updateFood(
    @Param('id') projectId: string,
    @Body() payload: UpdateFoodDto,
  ): Promise<void> {
    await this.#_foodService.updateFood({ ...payload, id: projectId });
  }

  @Delete('delete/food-image')
  async deleteFoodImage(@Body() payload: DeleteFoodImageDto): Promise<void> {
    await this.#_foodService.deleteOneFoodImage(payload);
  }

  @Delete('delete/:id')
  async deleteProject(@Param('id') foodId: string): Promise<void> {
    await this.#_foodService.deleteFood(foodId);
  }
}
