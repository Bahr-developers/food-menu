import {
  CreateRestourantInterface,
  UpdateRestourantRequest,
} from './interfaces';
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restourant } from './schemas';
import { Model, isValidObjectId } from 'mongoose';
import { Translate, TranslateService } from '../translate';
import { MinioService } from '../../client';

@Injectable()
export class RestourantService {
  constructor(
    @InjectModel(Restourant.name)
    private readonly restourantModel: Model<Restourant>,
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
      description: payload.description,
      location: payload.location,
      image_url: file.fileName,
    });

    await this.translateModel.findByIdAndUpdate(
      {
        _id: payload.name,
      },
      {
        status: 'active',
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
    await this.translateModel.findByIdAndUpdate(
      {
        _id: payload.location,
      },
      {
        status: 'active',
      },
    );
    newRestourant.save();
  }

  async getRestourantList(languageCode: string): Promise<Restourant[]> {
    const data = await this.restourantModel
      .find()
      .select('name description location image_url')
      .exec();

    let result = [];
    for (let x of data) {
      const name_request = {
        translateId: x.name.toString(),
        languageCode: languageCode,
      };

      const description_request = {
        translateId: x.description.toString(),
        languageCode: languageCode,
      };

      const translated_name = await this.service.getSingleTranslate(
        name_request,
      );
      const translated_description = await this.service.getSingleTranslate(
        description_request,
      );
      result.push({
        id: x._id,
        name: translated_name.value,
        description: translated_description.value,
        image_url: x.image_url,
        location: x.location,
      });
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

  async deleteRestourant(id: string): Promise<void> {
    await this.#_checkRestourant(id);
    const restourant = await this.restourantModel.findById(id)
    const deleteImageFile = await this.restourantModel.findById(id);

    await this.minioService.removeFile({ fileName: deleteImageFile.image_url }).catch(undefined => undefined);

    await this.translateModel.findByIdAndDelete(
      {
        _id: deleteImageFile.name,
      },
    );
    await this.translateModel.findByIdAndDelete(restourant.name)
    await this.translateModel.findByIdAndDelete(restourant.description)
    await this.translateModel.findByIdAndDelete(restourant.location)

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
}
