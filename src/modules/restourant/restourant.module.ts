import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule, MinioService } from '../../client';
import { Language, LanguageSchema } from '../language';
import { Definition, DefinitionSchema, Translate, TranslateSchema, TranslateService } from '../translate';
import { RestourantController } from './restourant.controller';
import { RestourantService } from './restourant.service';
import { Restourant, RestourantSchema } from './schemas';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restourant.name, schema: RestourantSchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: Definition.name, schema: DefinitionSchema },
      { name: Language.name, schema: LanguageSchema },
    ]),
    MinioModule,
  ],
  controllers: [RestourantController],
  providers: [RestourantService, TranslateService, MinioService],
})
export class RestourantModule {}
