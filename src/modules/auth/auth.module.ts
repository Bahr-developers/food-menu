import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../user/schemas';
import { UserSchema } from './../user/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
  imports: [
  MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
