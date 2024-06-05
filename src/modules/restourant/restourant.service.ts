import {
  AddOneSocialInterface,
  CreateRestourantInterface,
  DeleteOneSocialInterface,
  UpdateRestourantRequest,
} from './interfaces';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restourant } from './schemas';
import { Model, isValidObjectId } from 'mongoose';
import { Translate, TranslateService } from '../localisation/translate';
import { MinioService } from '../../client';
import { Social } from '../social/schemas';
import { RestourantTranslateService } from '../localisation_restaurant/translate.restaurant';
import { TranslateRestourant, TranslateRestourantSchema } from './../localisation_restaurant/translate.restaurant/schemas/translate.schema';

@Injectable()
export class RestourantService {
  constructor(
    @InjectModel(Restourant.name)
    private readonly restourantModel: Model<Restourant>,
    @InjectModel(Social.name)
    private readonly socialModel: Model<Social>,
    @InjectModel(TranslateRestourant.name)
    private readonly restourantTranslateModel: Model<TranslateRestourant>,
    @InjectModel(Translate.name)
    private readonly translateModel: Model<Translate>,
    private minioService: MinioService,
    private readonly service: TranslateService,
  ) {}

  async createRestourant(payload: CreateRestourantInterface): Promise<void> {
    await this.#_checkExistingRestourant(payload.name);
    await this.checkTranslate(payload.name);

    const file = await this.minioService.uploadFile({
      file: payload.image,
      bucket: 'food-menu',
    });

    const newRestourant = await this.restourantModel.create({
      name: payload.name,
      image_url: file.fileName,
    })

    await this.translateModel.findByIdAndUpdate(
      {
        _id: payload.name,
      },
      {
        status: 'active',
      },
    );
  }

  async getRestourantList(languageCode: string): Promise<Restourant[]> {
    const data = await this.restourantModel
      .find()
      .select('name description location image_url tel service_percent socials')
      .exec();

    let result = [];
    let forsocial = []
    let socials = []
    let value = ''
    let social_item = {}
    for (let x of data) {
      let social = []
      const name_request = {
        translateId: x.name.toString(),
        languageCode: languageCode,
        restourant_id: x.id
      };

      if(x.description?.length){
        const description_request = {
          translateId: x.description.toString(),
          languageCode: languageCode,
          restourant_id: x.id
        };
        
        const translated_description = await this.service.getSingleTranslate(
          description_request,
        )
        value = translated_description.value
        }
        
      const translated_name = await this.service.getSingleTranslate(
        name_request,
      );

      if(x.socials.length){
        for(const item of x.socials){
            socials.push({link:item.link, socials:await this.socialModel.findOne({_id: item.social_id})})          
          }
      }else{
        socials = []
      }
        
        result.push({
          id: x._id,
          name: translated_name.value,
          description: value,
          image_url: x.image_url,
          location: x.location,
          tel: x.tel,
          percent: x.service_percent,
          socials: socials    
        })
    }        
    return result;
  }

  async updateRestourant(payload: UpdateRestourantRequest): Promise<void> {
    await this.#_checkRestourant(payload.id);
    const restourant = await this.restourantModel.findById(payload.id)
    if(payload.name){
      await this.checkTranslate(payload.name);
      await this.translateModel.findByIdAndDelete(restourant.name)
      await this.restourantModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          name: payload.name,
        },
        );
        await this.translateModel.findByIdAndUpdate(
          {
            _id: payload.name,
          },
          {
            status: 'active',
          },
          );
        }
        if(payload.description){
          await this.checkTranslate(payload.description);
          await this.translateModel.findByIdAndDelete(restourant.description)
        await this.restourantModel.findByIdAndUpdate(
          { _id: payload.id },
          {
            description: payload.description
          },
        );
        await this.translateModel.findByIdAndUpdate(
          {
            _id: payload.description,
          },
          {
            status: 'active',
          },
        );
    }
    if(payload.location){
      await this.translateModel.findByIdAndDelete(restourant.location)
      await this.restourantModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          location: payload.location
        },
      );
      await this.translateModel.findByIdAndUpdate(
        {
          _id: payload.location,
        },
        {
          status: 'active',
        },
      );
    }
    if(payload.tel){
      await this.restourantModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          tel: payload.tel
        },
      );
    }
    if(payload.service_percent){
      await this.restourantModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          service_percent: payload.service_percent
        },
      );
    }
    if(payload.image){
        const deleteImageFile = await this.restourantModel.findById(payload.id);
      
        await this.minioService.removeFile({ fileName: deleteImageFile.image_url }).catch(undefined => undefined);
      
        const file = await this.minioService.uploadFile({
          file: payload.image,
          bucket: 'food-menu',
        });
        await this.restourantModel.findByIdAndUpdate(
          { _id: payload.id },
          {
            image_url: file.fileName,
          },
        );
    }
  }

  
  async addOneSocial(payload: AddOneSocialInterface): Promise<void> {
    await this.#_checkRestaurant(payload.restaurant_id);
    await this.#_checkSocial(payload.social.social_id)

    await this.restourantModel.findByIdAndUpdate(payload.restaurant_id, {
      $push: { socials: {social_id:payload.social.social_id, link: payload.social.link} },
    });
  }

  async deleteOneSocial(payload: DeleteOneSocialInterface): Promise<void> {
    await this.#_checkRestaurant(payload.restourant_id);
    await this.#_checkSocial(payload.social_id)

    const newSocils = []

    const foundedRestourant = await this.restourantModel.findById(payload.restourant_id);

    for(const item of foundedRestourant.socials){
      if(item.social_id==payload.social_id){
        continue
      }else{
        newSocils.push(item)
      }
    }
    await this.restourantModel.findByIdAndUpdate({_id: payload.restourant_id}, {
      socials: newSocils
    })
  }

  async deleteRestourant(id: string): Promise<void> {
    await this.#_checkRestourant(id);
    const restourant = await this.restourantModel.findById(id)
    const deleteImageFile = await this.restourantModel.findById(id);

    await this.minioService.removeFile({ fileName: deleteImageFile.image_url }).catch(undefined => undefined);

    if(deleteImageFile.description){
      await this.translateModel.findByIdAndDelete(
        {
          _id: deleteImageFile.description,
        },
      );
    }
    if(deleteImageFile.location){
      await this.translateModel.findByIdAndDelete(
        {
          _id: deleteImageFile.location,
        },
      );
    }
    await this.translateModel.findByIdAndDelete(
      {
        _id: deleteImageFile.name,
      },
    );
    await this.restourantModel.findByIdAndDelete({ _id: id });
  }

  async #_checkExistingRestourant(name: string): Promise<void> {
    const restourant = await this.restourantModel.findOne({
      name,
    });

    if (restourant) {
      throw new ConflictException(`${restourant.name} is already available`);
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

  async checkTranslate(id: string): Promise<void> {
    await this.#_checkId(id);
    const translate = await this.translateModel.findById(id);

    if (!translate) {
      throw new ConflictException(`Translate with ${id} is not exists`);
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
    const restaurant = await this.restourantModel.findById(id);

    if (!restaurant) {
      throw new ConflictException(`Restaurant with ${id} is not exists`);
    }
  }
}
