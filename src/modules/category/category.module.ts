import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule, MinioService } from '../../client';
import { Language, LanguageSchema } from '../language';
import { Definition, DefinitionSchema, Translate, TranslateSchema, TranslateService } from '../translate';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './schemas';
import { Restourant, RestourantSchema } from 'modules/restourant/schemas';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: Definition.name, schema: DefinitionSchema },
      { name: Language.name, schema: LanguageSchema },
      {name: Restourant.name, schema: RestourantSchema}
    ]),
    MinioModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService, TranslateService, MinioService],
})
export class CategoryModule {}
