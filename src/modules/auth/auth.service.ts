import { LoginForAdminRequest, LoginForAdminResponse } from './interfaces';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from '../user/schemas';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async LoginUser(
    payload: LoginForAdminRequest,
  ): Promise<LoginForAdminResponse> {
    const foundedUser = await this.userModel.findOne({ phone: payload.phone });
    if (foundedUser) {
      const is_Match = await bcrypt.compare(
        payload.password,
        foundedUser.password,
      );

      if (!is_Match) {
        throw new UnauthorizedException('Password incorrect');
      }
      return { restourant_id: foundedUser.restourant_id.toString() };
    } else {
      throw new ConflictException('Such Admin Not Found');
    }
  }
}
