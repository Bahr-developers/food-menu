import {
    CreateUserInterface,
    UpdateUserInterface
  } from './interfaces';
  import {
    ConflictException,
    Injectable,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { User } from './schemas';
  import { Model, isValidObjectId } from 'mongoose';
import { Restourant } from '../restourant/schemas';
  @Injectable()
  export class UserService {
    constructor(
      @InjectModel(User.name)
      private readonly userModel: Model<User>,
      @InjectModel(Restourant.name)
      private readonly restourantModel: Model<Restourant>,
    ) {}
  
    async createUser(payload: CreateUserInterface): Promise<void> {
      await this.#_checkRestourant(payload.restourant_id);
  
      const newUser = await this.userModel.create({
        full_name: payload.full_name,
        phone: payload.phone,
        restourant_id:payload.restourant_id
      });
      newUser.save();
    }
  
    async getUserList(): Promise<User[]> {
      const data = await this.userModel
        .find()
        .select('full_name phone restourant_id')
        .exec();
      return data;
    }
  
    async updateUser(payload: UpdateUserInterface): Promise<void> {
      await this.#_chechUser(payload.id);
      if(payload.full_name){
        await this.userModel.findByIdAndUpdate(
          { _id: payload.id },
          {
            name: payload.full_name,
          },
          );
        }
      if(payload.phone){
          await this.userModel.findByIdAndUpdate(
            { _id: payload.id },
            {
              phone: payload.phone
            },
          );
      }
    }
  
    async deleteUser(id: string): Promise<void> {
      await this.#_chechUser(id);
      await this.userModel.findByIdAndDelete({ _id: id });
    }

    async #_chechUser(id: string): Promise<void> {
      await this.#_checkId(id);
      const user = await this.userModel.findById(id);
  
      if (!user) {
        throw new ConflictException(`User with ${id} is not exists`);
      }
    }

    async #_checkRestourant(id: string): Promise<void> {
      await this.#_checkId(id);
      const restourant = await this.restourantModel.findById(id);
  
      if (!restourant) {
        throw new ConflictException(`Restourant with ${id} is not exists`);
      }
    }
  
    async #_checkId(id: string): Promise<void> {
      const isValid = isValidObjectId(id);
      if (!isValid) {
        throw new UnprocessableEntityException(`Invalid ${id} Object ID`);
      }
    }
  }
  