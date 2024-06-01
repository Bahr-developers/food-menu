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
  import * as bcrypt from 'bcrypt'
import { MinioService } from '../../client';
  @Injectable()
  export class UserService {
    constructor(
      @InjectModel(User.name)
      private readonly userModel: Model<User>,
      @InjectModel(Restourant.name)
      private readonly restourantModel: Model<Restourant>,
      private minioService: MinioService,

    ) {}
  
    async createUser(payload: CreateUserInterface): Promise<void> {
      await this.#_checkRestourant(payload.restourant_id);
      let image = ''

      if(payload.image){
        const file = await this.minioService.uploadFile({
          file: payload.image,
          bucket: 'food-menu',
        });
        image = file.fileName
      }
      const hashed_password = await bcrypt.hash(payload.password, 7)
  
      const newUser = await this.userModel.create({
        full_name: payload.full_name,
        phone: payload.phone,
        password:hashed_password,
        image_url: image,
        restourant_id:payload.restourant_id
      });
      newUser.save();
    }
  
    async getUserList(): Promise<User[]> {
      const data = await this.userModel
        .find()
        .select('full_name phone restourant_id password image_url')
        .exec();
      return data;
    }
  
    async getUserByRestourantId(restaurant_id: string): Promise<User> {
      const data = await this.userModel
        .findOne({restaurant_id: restaurant_id})
        .select('full_name phone restourant_id password image_url')
        .exec();
      return data;
    }
  
    async updateUser(payload: UpdateUserInterface): Promise<void> {
      await this.#_chechUser(payload.id);
      if(payload.full_name){
        await this.userModel.findByIdAndUpdate(
          { _id: payload.id },
          {
            full_name: payload.full_name,
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
      if(payload.image){
        const deleteImageFile = await this.userModel.findById(payload.id);
        await this.minioService.removeFile({ fileName: deleteImageFile.image_url }).catch(undefined => undefined);
        const file = await this.minioService.uploadFile({
          file: payload.image,
          bucket: 'food-menu',
        });
        await this.userModel.findByIdAndUpdate(
          { _id: payload.id },
          {
            image_url: file.fileName,
          },
        );
      }
      if(payload.password){
      const hashed_password = await bcrypt.hash(payload.password, 7)
        await this.userModel.findByIdAndUpdate(
          {_id:payload.id},
          {
            password:hashed_password
          }
        )
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
  