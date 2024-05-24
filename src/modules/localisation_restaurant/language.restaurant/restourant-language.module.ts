import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioService } from '../../../client';
import { Restourant, RestourantSchema } from '../../restourant/schemas';
import { RestourantLanguageController } from './restourant-language.controller';
import { RestourantLanguageService } from './restourant-language.service';
import { LanguageRestourant, LanguageRestourantSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LanguageRestourant.name, schema: LanguageRestourantSchema },
      { name: Restourant.name, schema: RestourantSchema },
    ]),
  ],
  controllers: [RestourantLanguageController],
  providers: [RestourantLanguageService, MinioService],
})
export class RestourantLanguageModule {}
