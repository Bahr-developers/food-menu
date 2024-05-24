import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule, MinioService } from '../../client';
import { Language, LanguageSchema } from '../localisation/language';
import { Definition, DefinitionSchema, Translate, TranslateSchema, TranslateService } from '../localisation/translate';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './schemas';
import { Restourant, RestourantSchema } from 'modules/restourant/schemas';
import { DefinitionRestourant, DefinitionRestourantSchema, RestourantTranslateService, TranslateRestourant, TranslateRestourantSchema } from '../localisation_restaurant/translate.restaurant';
import { LanguageRestourant, LanguageRestourantSchema } from '../localisation_restaurant/language.restaurant';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: TranslateRestourant.name, schema: TranslateRestourantSchema },
      { name: Definition.name, schema: DefinitionSchema },
      { name: DefinitionRestourant.name, schema: DefinitionRestourantSchema },
      { name: Language.name, schema: LanguageSchema },
      { name: LanguageRestourant.name, schema: LanguageRestourantSchema },
      {name: Restourant.name, schema: RestourantSchema}
    ]),
    MinioModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, RestourantTranslateService, MinioService],
})
export class CategoryModule {}
