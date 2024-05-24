import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule, MinioService } from '../../client';
import { Category, CategorySchema } from '../category/schemas';
import { Language, LanguageSchema } from '../localisation/language';
import { Definition, DefinitionSchema, Translate, TranslateSchema, TranslateService } from '../localisation/translate';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { Food, FoodSchema } from './schemas';
import { LanguageRestourant, LanguageRestourantSchema } from '../localisation_restaurant/language.restaurant';
import { DefinitionRestourant, DefinitionRestourantSchema, RestourantTranslateService, TranslateRestourant, TranslateRestourantSchema } from '../localisation_restaurant/translate.restaurant';
import { Restourant, RestourantSchema } from '../restourant/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Food.name, schema: FoodSchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: TranslateRestourant.name, schema: TranslateRestourantSchema },
      { name: DefinitionRestourant.name, schema: DefinitionRestourantSchema },
      { name: Definition.name, schema: DefinitionSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Language.name, schema: LanguageSchema },
      { name: LanguageRestourant.name, schema: LanguageRestourantSchema },
      { name: Restourant.name, schema: RestourantSchema },
    ]),
    MinioModule,
  ],
  controllers: [FoodController],
  providers: [FoodService, RestourantTranslateService, MinioService],
})
export class FoodModule {}