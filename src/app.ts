import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './modules/category/category.module';
import { FoodModule } from './modules/food/food.module';
import { LanguageModule } from './modules/language';
import { RestourantModule } from './modules/restourant/restourant.module';
import { TranslateModule } from './modules/translate';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/food_menu'),
    TranslateModule,
    LanguageModule,
    RestourantModule,
    CategoryModule,
    FoodModule
  ],
})
export class AppModule {}
