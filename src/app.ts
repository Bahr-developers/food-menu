import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from '@client';
import { minioConfig } from '@config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [minioConfig],
    }),
    MinioModule,
  ],
})
export class AppModule {}
