import {
  CreateRestourantLanguageRequest,
  UpdateRestourantLanguageRequest,
} from './interfaces';
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { LanguageRestourant } from './schemas';
import { MinioService } from '../../../client';
import { RestourantTranslateService } from '../translate.restaurant/restourant-translate.service';

@Injectable()
export class RestourantLanguageService {
  constructor(
    @InjectModel(LanguageRestourant.name)
    private readonly restaurantLanguageModel: Model<LanguageRestourant>,
    private minioService: MinioService,
  ) {}

  async createLanguage(
    payload: CreateRestourantLanguageRequest,
  ): Promise<void> {
    await this.#_checkExistingLanguage(payload.code, payload.restourant_id);

    const file = await this.minioService.uploadFile({
      file: payload.image,
      bucket: 'food-menu',
    });

    const newLanguage = await this.restaurantLanguageModel.create({
      code: payload.code,
      title: payload.title,
      image_url: file.fileName,
      restourant_id: payload.restourant_id,
    });

    newLanguage.save();
  }

  async getLanguageList(restaurantId: string): Promise<LanguageRestourant[]> {
    const data = await this.restaurantLanguageModel
      .find({ restourant_id: restaurantId })
      .select('title id code image_url restourant_id')
      .exec();

    return data;
  }

  async updateLanguage(
    payload: UpdateRestourantLanguageRequest,
  ): Promise<void> {
    await this.#_checkRestourantLanguage(payload.id);
    if (payload.title) {
      await this.restaurantLanguageModel.findByIdAndUpdate(
        {
          _id: payload.id,
        },
        {
          title: payload.title,
        },
      );
    }

    if (payload.image) {
      const deleteImageFile = await this.restaurantLanguageModel.findById(
        payload.id,
      );
      await this.minioService
        .removeFile({ fileName: deleteImageFile.image_url })
        .catch((undefined) => undefined);
      const file = await this.minioService.uploadFile({
        file: payload.image,
        bucket: 'food-menu',
      });
      await this.restaurantLanguageModel.findByIdAndUpdate(
        { _id: payload.id },
        {
          image_url: file.fileName,
        },
      );
    }
  }

  async deleteLanguage(id: string): Promise<void> {
    await this.#_checkRestourantLanguage(id);
    const data = await this.restaurantLanguageModel
      .findById({ _id: id })
      .select('id')
      .exec();

    await this.restaurantLanguageModel.findByIdAndDelete({ _id: id });
  }

  async #_checkExistingLanguage(
    code: string,
    restourant_id: string,
  ): Promise<void> {
    const language_restourant = await this.restaurantLanguageModel.findOne({
      code: code,
      restourant_id: restourant_id,
    });

    if (language_restourant) {
      throw new ConflictException(
        `${language_restourant.title} is already available`,
      );
    }
  }

  async #_checkRestourantLanguage(id: string): Promise<void> {
    await this.#_checkId(id);
    const language = await this.restaurantLanguageModel.findById(id);

    if (!language) {
      throw new ConflictException(`Language with ${id} is not exists`);
    }
  }

  async #_checkId(id: string): Promise<void> {
    const isValid = isValidObjectId(id);
    if (!isValid) {
      throw new UnprocessableEntityException(`Invalid ${id} Object ID`);
    }
  }
}
