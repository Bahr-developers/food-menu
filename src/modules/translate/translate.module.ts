import { Module } from '@nestjs/common';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Language, LanguageSchema } from 'modules/language';
import {
  Definition,
  DefinitionSchema,
  Translate,
  TranslateSchema,
} from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: Definition.name, schema: DefinitionSchema },
    ]),
  ],
  controllers: [TranslateController],
  providers: [TranslateService],
  exports: [TranslateService]
})
export class TranslateModule {}
