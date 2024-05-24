import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule, MinioService } from '../../client';
import { Language, LanguageSchema } from '../localisation/language';
import { Social, SocialSchema } from '../social/schemas';
import { Definition, DefinitionSchema, Translate, TranslateSchema, TranslateService } from '../localisation/translate';
import { RestourantController } from './restourant.controller';
import { RestourantService } from './restourant.service';
import { Restourant, RestourantSchema } from './schemas';
import { DefinitionRestourant, DefinitionRestourantSchema, RestourantTranslateService, TranslateRestourant, TranslateRestourantSchema } from '../localisation_restaurant/translate.restaurant';
import { LanguageRestourant, LanguageRestourantSchema } from '../localisation_restaurant/language.restaurant';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restourant.name, schema: RestourantSchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: TranslateRestourant.name, schema: TranslateRestourantSchema },
      { name: Definition.name, schema: DefinitionSchema },
      { name: DefinitionRestourant.name, schema: DefinitionRestourantSchema },
      { name: Language.name, schema: LanguageSchema },
      { name: LanguageRestourant.name, schema: LanguageRestourantSchema },
      { name: Social.name, schema: SocialSchema },
    ]),
    MinioModule,
  ],
  controllers: [RestourantController],
  providers: [RestourantService, TranslateService, MinioService],
})
export class RestourantModule {}
