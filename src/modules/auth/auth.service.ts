import {
    LoginForAdminRequest,
    LoginForAdminResponse
  } from './interfaces';
  import {
    ConflictException,
    Injectable,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model, isValidObjectId } from 'mongoose';
  import { Translate, TranslateService } from '../translate';
import { User } from '../user/schemas';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectModel(User.name)
      private readonly userModel: Model<User>,
    ) {}
  
    async LoginUser(payload: LoginForAdminRequest): Promise<LoginForAdminResponse> {
        const foundedUser = await this.userModel.findOne({phone:payload.phone})
        if(foundedUser){
            return {restourant_id:foundedUser.restourant_id.toString()}
        }else{
            throw new ConflictException("Such Admin Not Found") 
        }
    }
}