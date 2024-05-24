import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LanguageRestourant, LanguageRestourantSchema } from '../language.restaurant';
import { DefinitionRestourant, DefinitionRestourantSchema, TranslateRestourant, TranslateRestourantSchema } from './schemas';
import { RestourantTranslateController } from './restourant-translate.controller';
import { RestourantTranslateService } from './restourant-translate.service';
import { Restourant, RestourantSchema } from '../../restourant/schemas';
import { Language, LanguageSchema } from '../../localisation/language';
import { Definition, DefinitionSchema, Translate, TranslateSchema } from '../../localisation/translate';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LanguageRestourant.name, schema: LanguageRestourantSchema },
      { name: Language.name, schema: LanguageSchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: Definition.name, schema: DefinitionSchema },
      { name: TranslateRestourant.name, schema: TranslateRestourantSchema },
      { name: DefinitionRestourant.name, schema: DefinitionRestourantSchema },
      { name: Restourant.name, schema: RestourantSchema },
    ]),
  ],
  controllers: [RestourantTranslateController],
  providers: [RestourantTranslateService],
  exports: [RestourantTranslateService]
})
export class RestourantTranslateModule {}
