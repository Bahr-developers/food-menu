import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MinioModule, MinioService } from '../../client';
import { Social, SocialSchema } from './schemas';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { Restourant, RestourantSchema } from 'modules/restourant/schemas';

@Module({
  imports: [
  MongooseModule.forFeature([
      {name: Social.name, schema: SocialSchema},
      {name: Restourant.name, schema: RestourantSchema}
    ]),
    MinioModule,
  ],
  controllers: [SocialController],
  providers: [SocialService, MinioService],
})
export class SocialModule {}
