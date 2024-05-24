import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { MinioService } from '../../client';
import { Restourant } from 'modules/restourant/schemas';
import { Social } from './schemas';
import { AddOneSocialInterface, CreateSocialInterface, UpdateSocialInterface } from './interfaces';
@Injectable()
export class SocialService {
  constructor(
    @InjectModel(Social.name) private readonly socialModel: Model<Social>,
    @InjectModel(Restourant.name) private readonly restaurantModel: Model<Restourant>,
    private minioService: MinioService,
  ) {}

  async createSocial(payload: CreateSocialInterface): Promise<void> {
    await this.#_checkExistingSocial(payload.name)
    
    let image = ''

    if(payload.image){
      const file = await this.minioService.uploadFile({
        file: payload.image,
        bucket: 'food-menu',
      });
      image = file.fileName
    }
    const newCategoriy = await this.socialModel.create({
        name: payload.name,
        image:image,
    });
      newCategoriy.save();
    }

  async getSocialById(id: string): Promise<Social[]> {
    await this.#_checkSocial(id)
    const data = await this.socialModel
      .find({_id:id})
      .select('name image')
      .exec();

    return data
  }
  async getSocialList(): Promise<Social[]> {
    const data = await this.socialModel
      .find()
      .select('name image')
      .exec();

    return data
  }

  async updateSocial(payload: UpdateSocialInterface): Promise<void> {
    await this.#_checkSocial(payload.id); 
    const social = await this.socialModel.findById(payload.id)   
    if(payload.name){
      await this.socialModel.findByIdAndUpdate(payload.id, {
        name:payload.name
      })
    }
    if(payload.image){
      const deleteImageFile = await this.socialModel.findById(payload.id);
      await this.minioService.removeFile({ fileName: deleteImageFile.image }).catch(undefined => undefined);
      const file = await this.minioService.uploadFile({
        file: payload.image,
        bucket: 'food-menu',
      });
      await this.socialModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          image_url: file.fileName,
        },
      );
    }
  }

  async deleteSocial(id: string): Promise<void> {
    await this.#_checkSocial(id);
    const deleteImageFile = await this.socialModel.findById(id);
    if(deleteImageFile.image){
          await this.minioService.removeFile({ fileName: deleteImageFile.image }).catch(undefined => undefined);
        }
        await this.socialModel.findByIdAndDelete({ _id: id });
  }

  async #_checkExistingSocial(name: string): Promise<void> {
    const social = await this.socialModel.findOne({
      name,
    });

    if (social) {
      throw new ConflictException(`${social.name} is already available`);
    }
  }

  async #_checkSocial(id: string): Promise<void> {
    await this.#_checkId(id);
    const social = await this.socialModel.findById(id);

    if (!social) {
      throw new ConflictException(`Social with ${id} is not exists`);
    }
  }

  async #_checkRestaurant(id: string): Promise<void> {
    await this.#_checkId(id);
    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      throw new ConflictException(`Restaurant with ${id} is not exists`);
    }
  }

  async #_checkId(id: string): Promise<void> {
    const isValid = isValidObjectId(id);
    if (!isValid) {
      throw new UnprocessableEntityException(`Invalid ${id} Object ID`);
    }
  }
}
