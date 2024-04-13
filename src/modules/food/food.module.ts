import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule, MinioService } from '../../client';
import { Category, CategorySchema } from '../category/schemas';
import { Language, LanguageSchema } from '../language';
import { Restourant, RestourantSchema } from '../restourant/schemas';
import { Definition, DefinitionSchema, Translate, TranslateSchema, TranslateService } from '../translate';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { Food, FoodSchema } from './schemas';

@Module({
  imports: [
  MongooseModule.forFeature([
      { name: Food.name, schema: FoodSchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: Definition.name, schema: DefinitionSchema},
      { name: Category.name, schema: CategorySchema },
      { name: Restourant.name, schema: RestourantSchema },
      { name: Language.name, schema: LanguageSchema }
    ]),
    MinioModule,
  ],
  controllers: [FoodController],
  providers: [FoodService, TranslateService, MinioService],
})
export class FoodModule {}
