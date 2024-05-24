import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './modules/category/category.module';
import { FoodModule } from './modules/food/food.module';
import { RestourantModule } from './modules/restourant/restourant.module';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from '@client';
import { minioConfig } from '@config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SocialModule } from './modules/social/social.module';
import { TranslateModule } from './modules/localisation/translate';
import { LanguageModule } from './modules/localisation/language';
import { RestourantLanguageModule } from './modules/localisation_restaurant/language.restaurant';
import { RestourantTranslateModule } from './modules/localisation_restaurant/translate.restaurant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [minioConfig],
    }),
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/food_menu'),
    TranslateModule,
    LanguageModule,
    RestourantModule,
    CategoryModule,
    FoodModule,
    MinioModule,
    UserModule,
    AuthModule,
    SocialModule,
    RestourantLanguageModule,
    RestourantTranslateModule
  ],
})
export class AppModule {}
