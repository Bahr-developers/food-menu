import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioService } from '../../client';
import { Language, LanguageSchema } from '../localisation/language';
import { Definition, DefinitionSchema, Translate, TranslateSchema, TranslateService } from '../localisation/translate';
import { Restourant, RestourantSchema } from '../restourant/schemas';
import { User, UserSchema } from './schemas';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Module({
  imports: [
    MongooseModule.forFeature([  
      { name: User.name, schema: UserSchema },
      { name: Restourant.name, schema: RestourantSchema },
      { name: Translate.name, schema: TranslateSchema },
      { name: Definition.name, schema: DefinitionSchema },
      { name: Language.name, schema: LanguageSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, MinioService],
})
export class UserModule {}
